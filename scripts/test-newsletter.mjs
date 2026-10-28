import assert from "node:assert/strict";
import { getNewsletterConfig, handleNewsletterRequest } from "../src/lib/kit-newsletter.mjs";

const env = {
  KIT_V4_API_KEY: "test-credential-never-publish",
  KIT_NEWSLETTER_FORM_ID: "123456",
  KIT_FORM_CONFIRMATION_VERIFIED: "true",
};
const origin = "https://mystagogia.test";
function makeRequest(data, options = {}) {
  return new Request(origin + "/api/newsletter", {
    method: options.method || "POST",
    headers: options.headers || {
      "Origin": origin,
      "Content-Type": "application/json",
      "x-real-ip": "192.0.2.24",
    },
    ...(options.method === "GET" ? {} : { body: options.raw ?? JSON.stringify(data) }),
  });
}
const rateLimit = () => false;
async function answer(request, opts = {}) {
  const response = await handleNewsletterRequest(request, {
    env: opts.env ?? env,
    fetchImpl: opts.fetchImpl ?? (()=>{throw Error("Unexpected provider call");}),
    rateLimit: opts.rateLimit ?? rateLimit,
    now: 123456,
  });
  const body = await response.json();
  return { status: response.status, body, headers: response.headers };
}
assert.equal(getNewsletterConfig({}), null);
assert.equal(getNewsletterConfig({...env, KIT_FORM_CONFIRMATION_VERIFIED: "false"}), null);
assert.equal(getNewsletterConfig({...env, KIT_NEWSLETTER_FORM_ID: "abc"}), null);
assert.equal(getNewsletterConfig(env).formId, "123456");
let r = await answer(makeRequest({}, {method:"GET"}),{env:{}});
assert.deepEqual(r.body,{available:false});
r = await answer(makeRequest({email:"reader@example.com",consent:true}),{env:{}});
assert.equal(r.status,503);
assert.ok(!JSON.stringify(r.body).includes("test-credential"));
r = await answer(makeRequest({}, {method:"GET"}));
assert.deepEqual(r.body,{available:true});

const responseOK = (body) => new Response(JSON.stringify(body),{
  status:201, headers:{"content-type":"application/json"},
});
const calls=[];
async function fakeKit(url, opts) {
  calls.push({url,opts});
  return responseOK({subscriber:{id:123, email_address:"reader@example.com"}});
}
r=await answer(makeRequest({email:" READER@example.com ",consent:true,website:""}),{
  fetchImpl:fakeKit,
});
assert.equal(r.status,202);
assert.equal(r.body.code,"received");
assert.ok(r.body.message.includes("confirmation"),"Never claim newsletter is confirmed");
assert.equal(calls.length,2);
assert.equal(calls[0].url,"https://api.kit.com/v4/subscribers");
assert.equal(calls[1].url,"https://api.kit.com/v4/forms/123456/subscribers");
assert.equal(calls[0].opts.headers["X-Kit-Api-Key"],env.KIT_V4_API_KEY);
assert.deepEqual(JSON.parse(calls[0].opts.body),{
  email_address:"reader@example.com", state:"inactive",
});
assert.deepEqual(JSON.parse(calls[1].opts.body),{email_address:"reader@example.com"});

for(const invalid of ["", "plainaddress", "x@", "two words@example.com",
  "a@domain", "<script>@example.com"]) {
  r=await answer(makeRequest({email:invalid,consent:true}),{fetchImpl:fakeKit});
  assert.equal(r.status,400,"Invalid email: "+invalid);
}
r=await answer(makeRequest({email:"reader@example.com",consent:false}),{fetchImpl:fakeKit});
assert.equal(r.status,400); assert.equal(r.body.code,"consent_required");
r=await answer(makeRequest({email:"reader@example.com",consent:true,website:"spam"}),{fetchImpl:fakeKit});
assert.equal(r.status,202);assert.equal(r.body.code,"received");
assert.equal(calls.length,2,"Honeypot must not call Kit");
r=await answer(makeRequest({email:"reader@example.com",consent:true}),{
  fetchImpl:fakeKit, rateLimit:()=>true,
});
assert.equal(r.status,429);
r=await answer(makeRequest({email:"reader@example.com",consent:true},{headers:{
  "Origin":"https://another-site.example", "Content-Type":"application/json",
}}),{fetchImpl:fakeKit});
assert.equal(r.status,403);
r=await answer(makeRequest({email:"reader@example.com",consent:true},{headers:{
  "Origin":origin, "Content-Type":"text/plain",
}}),{fetchImpl:fakeKit});
assert.equal(r.status,415);
r=await answer(makeRequest({}, {raw:"not-json"}),{fetchImpl:fakeKit});
assert.equal(r.status,400);
assert.equal(calls.length,2,"Invalid input never calls Kit");

for (const failAt of [1,2]) {
  const events=[];
  r=await answer(makeRequest({email:"reader@example.com",consent:true}),{
    fetchImpl:async(url,opts)=>{
      events.push(url);
      return events.length===failAt ? new Response('{"errors":["private provider data"]}',{status:401}) :
        responseOK({subscriber:{id:1}});
    },
  });
  assert.equal(r.status,502,"Provider failure cannot become successful signup");
  assert.ok(!JSON.stringify(r.body).includes("private provider data"));
  assert.equal(events.length,failAt,"Second Kit call only if first succeeded");
}
r=await answer(makeRequest({email:"reader@example.com",consent:true}),{
  fetchImpl:async()=>{ throw Error("secret exception from Kit"); },
});
assert.equal(r.status,502);
assert.ok(!JSON.stringify(r.body).includes("secret exception"));

console.log("PASS: Kit disabled state, consent, email validation, rate limit, honeypot, origin, provider failures and accepted request");
