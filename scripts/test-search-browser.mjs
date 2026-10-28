/**
 * Real Pagefind browser acceptance. Run AFTER test:pagefind-build, which leaves
 * synthetic published pages in dist while removing their source MDX files.
 * No new Astro build, no committed editorial fixtures.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";

const origin = "http://127.0.0.1:8179";
const chromeUrl = "http://127.0.0.1:9257";
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

assert.ok(fs.existsSync("dist/pagefind/pagefind.js"), "Run test:pagefind-build before browser QA");
assert.ok(fs.existsSync("dist/search/index.html"), "Search page must exist in fixture build");
const server = spawn("python3", ["-m","http.server","8179","--bind","127.0.0.1","--directory","dist"], {stdio:"ignore"});
const chrome = spawn("google-chrome", [
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--remote-allow-origins=*","--remote-debugging-port=9257",
  "--user-data-dir=/tmp/mystagogia-search-qa-"+process.pid,
  origin+"/search/",
],{stdio:"ignore"});
let socket, requestId=0;
const requests = new Map();
async function waitFor(task, why) {
  for (let i=0;i<110;i++) {
    try { const v=await task();if(v)return v; }catch {}
    await pause(200);
  }
  throw new Error("Search browser timeout: "+why);
}
function send(method,params={}) {
  return new Promise((resolve,reject)=>{
    const id=++requestId;
    const timer=setTimeout(()=>{requests.delete(id);reject(Error("Chrome timeout "+method));},12000);
    requests.set(id,{resolve,reject,timer});
    socket.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.result.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));
  return r.result.result.value;
}
const snap=()=>evaluate(`(() => ({
  width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
  location: location.pathname+location.search,
  h1:document.querySelectorAll("main h1").length,
  role:!!document.querySelector('[role="search"]'),
  status:document.querySelector("[data-search-status]")?.textContent?.trim(),
  busy:document.querySelector("[data-search-results]")?.hasAttribute("aria-busy"),
  links:[...document.querySelectorAll(".search-result__title")].map(a=>({
    href:a.getAttribute("href"),label:a.textContent.trim()
  })),
  groups:[...document.querySelectorAll(".search-group h3")].map(h=>h.textContent.trim()),
  scope:document.querySelector('input[name="scope"]:checked')?.value,
  input:document.querySelector("[data-search-input]")?.value,
  shop:!!document.querySelector('input[value="shop"]'),
  headerSearch:!!document.querySelector('.header-actions a[href="/search/"]'),
  mobileSearch:!!document.querySelector('.mobile-dialog a[href="/search/"]'),
}))()`);
async function visit(url) {
  await send("Page.navigate",{url:origin+url});
  await waitFor(async()=>evaluate(
    'document.readyState==="complete" && !!document.querySelector("[data-search-form]")'
  ),"search DOM loaded");
}
async function settled() {
  return await waitFor(async()=>{
    const s=await snap();
    return !s.busy && s.status && !/checking|searching/i.test(s.status) ? s : false;
  },"Pagefind search settled");
}
try{
  await waitFor(async()=> (await fetch(origin+"/search/")).ok,"HTTP server");
  const tab=await waitFor(async()=>{
    const x=await (await fetch(chromeUrl+"/json/list")).json();
    return x.find((x)=>x.type==="page" && x.webSocketDebuggerUrl);
  },"headless Chrome");
  socket=new WebSocket(tab.webSocketDebuggerUrl);
  socket.addEventListener("message",(event)=>{
    const msg=JSON.parse(event.data),pending=requests.get(msg.id);
    if(!pending)return;
    clearTimeout(pending.timer);requests.delete(msg.id);
    if(msg.error)pending.reject(Error(JSON.stringify(msg.error)));
    else pending.resolve(msg);
  });
  await new Promise((resolve,reject)=>{
    socket.addEventListener("open",resolve,{once:true});
    socket.addEventListener("error",reject,{once:true});
  });
  await send("Page.enable");await send("Runtime.enable");
  fs.mkdirSync("qa-artifacts/search",{recursive:true});
  for (const width of [375,1440]) {
    await send("Emulation.setDeviceMetricsOverride",{
      width,height:900,deviceScaleFactor:1,mobile:false,
    });
    await visit("/search/?q=Methodological%20context");
    let result=await settled();
    assert.equal(result.width,width);
    assert.ok(result.scrollWidth<=width+1,"No search overflow at "+width);
    assert.equal(result.h1,1);
    assert.equal(result.role,true);
    assert.equal(result.shop,false,"No Shop tab");
    assert.equal(result.headerSearch,true);
    assert.equal(result.mobileSearch,true);
    assert.equal(result.scope,"all");
    assert.deepEqual(result.groups,["The Library","The Grimoire"],
      "All scope groups both indexed collections");
    assert.deepEqual(result.links.map(x=>x.href).sort(),
      ["/grimoire/qa-pagefind-grimoire/","/library/qa-pagefind-library/"]);
    assert.ok(result.status.includes("2 published articles"));

    await evaluate(`document.querySelector('input[name="scope"][value="library"]').click()`);
    result=await settled();
    assert.equal(result.scope,"library");
    assert.ok(result.location.includes("scope=library"));
    assert.deepEqual(result.links.map(x=>x.href),["/library/qa-pagefind-library/"]);
    assert.deepEqual(result.groups,["The Library"]);

    await evaluate(`document.querySelector('input[name="scope"][value="grimoire"]').click()`);
    result=await settled();
    assert.equal(result.scope,"grimoire");
    assert.deepEqual(result.links.map(x=>x.href),["/grimoire/qa-pagefind-grimoire/"]);

    // Keyboard Enter submits a new real term and preserves scope in the URL.
    await evaluate(`(() => {
      const el=document.querySelector("[data-search-input]");
      el.value="Moonpetal";
      el.focus();
    })()`);
    await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
    await send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
    result=await settled();
    assert.ok(result.location.includes("q=Moonpetal"));
    assert.equal(result.scope,"grimoire");
    assert.deepEqual(result.links.map(x=>x.href),["/grimoire/qa-pagefind-grimoire/"]);

    await visit("/search/?q=ForbiddenDraftWord");
    result=await settled();
    assert.equal(result.links.length,0);
    assert.ok(result.status.includes("No matching"),"Draft phrase never returns");
    await visit("/search/?q=ForbiddenReviewWord");
    result=await settled();
    assert.equal(result.links.length,0);
    await visit("/search/?q=ForbiddenPreviewWord");
    result=await settled();
    assert.equal(result.links.length,0);
    // URL encoding survives deep links and refresh.
    await visit("/search/?q=Moonpetal%20vellum&scope=grimoire");
    result=await settled();
    assert.equal(result.input,"Moonpetal vellum");
    assert.equal(result.scope,"grimoire");
    assert.deepEqual(result.links.map(x=>x.href),["/grimoire/qa-pagefind-grimoire/"]);
    const png=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,fromSurface:true});
    fs.writeFileSync("qa-artifacts/search/search-"+width+".png",Buffer.from(png.result.data,"base64"));
    console.log("PASS: Pagefind search keyboard, shareable URL, collection scopes, exclusion at "+width+"px");
  }
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  server.kill("SIGTERM");
}
