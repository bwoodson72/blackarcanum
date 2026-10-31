// SF-07: truthful profile presentation and shared link gate in an isolated site.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createServicesFixture } from "./lib/services-fixture-qa.mjs";
const { root, fixture, origin, write, prepare, build, startBrowser, send, evaluate, waitFor, capture, close } = createServicesFixture("practitioner", 4196, 9256);
const fact = text => ({ text, approved: true, verified: true, verificationNote: "PRIVATE_VERIFICATION_SENTINEL" });
const history = { period: "Technical fixture period", title: "Practice history fixture", description: "Technical review only. No actual experience is represented.", approved: true, verified: true };
const profile = {
  status: "published", approved: true,
  summary: fact("Synthetic résumé fixture for technical review only."),
  biography: [fact("This is a technical biography fixture, not a statement about a real practitioner."), fact("No identity, training, initiation or credential is asserted by this test data.")],
  practiceHistory: [history],
  disciplines: [fact("Discipline fixture — no actual tradition represented."), { ...fact("UNVERIFIED_CLAIM_SENTINEL"), verified: false }],
  training: [{ ...history, title: "Training fixture — not a credential" }, { ...history, title: "UNAPPROVED_CREDENTIAL_SENTINEL", approved: false }],
  kindsOfWork: [fact("Kinds-of-work fixture — not a real service description.")],
  selectedWork: [fact("Publication fixture — not a real work.")],
  principles: [fact("Approach fixture — technical copy only.")],
};
function source(data) { write("src/data/practitioner.ts", "// Isolated technical fixture only.\nexport const practitionerProfile = " + JSON.stringify(data, null, 2) + ";\n"); }
function cleanBuild() {
  fs.rmSync(path.join(fixture, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(fixture, ".astro"), { recursive: true, force: true });
  build();
}
function noProfileLinks() {
  for (const file of ["services/index.html", "services/love/qa-profile-service/index.html"]) {
    const full = path.join(fixture, "dist", file);
    if (fs.existsSync(full)) assert.doesNotMatch(fs.readFileSync(full, "utf8"), /href="\/services\/practitioner\/"|<section\b[^>]*data-practitioner-(?:teaser|link)/);
  }
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/practitioner/index.html")), false);
}
try {
  prepare();
  for (const file of ["services/[...index].astro", "services/[sphere].astro", "services/[sphere]/[slug].astro", "services/practitioner/[...page].astro"]) {
    write("src/pages/" + file, fs.readFileSync(path.join(root, "src/pages", file), "utf8"));
  }
  write("src/pages/index.astro", '<!doctype html><html lang="en"><title>QA only</title><h1>Technical résumé fixtures</h1></html>');
  const registry = path.join(fixture, "src/data/service-spheres.ts");
  fs.writeFileSync(registry, fs.readFileSync(registry, "utf8").replace('id: "love", label: "Love & Relationships", order: 1, visible: false, published: false', 'id: "love", label: "Love & Relationships", order: 1, visible: true, published: true'));
  const product = { slug: "qa-profile-service", title: "Synthetic service fixture", summary: "Technical fixture only", sphere: "love", kind: "reading", status: "published", approved: true, priceUsdCents: 12345, scope: "Fixture", inclusions: ["Fixture"], process: ["Fixture"], turnaround: "Fixture", clientRequirements: ["Fixture"] };
  write("src/content/services/qa-profile-service.mdx", "---\n" + Object.entries(product).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join("\n") + "\n---\n");
  source(profile);
  cleanBuild(); assert.equal(fs.existsSync(path.join(fixture, "dist/services/practitioner/index.html")), true); // Approved facts are normally browsable.
  write("src/data/services-release.ts", "export const servicesPublicReleaseApproved: boolean = true;\n");
  source({ status: "draft" }); cleanBuild(); noProfileLinks();
  source(profile); cleanBuild();
  const profileHtml = fs.readFileSync(path.join(fixture, "dist/services/practitioner/index.html"), "utf8");
  assert.equal((profileHtml.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(profileHtml, /PRIVATE_VERIFICATION_SENTINEL|UNVERIFIED_CLAIM_SENTINEL|UNAPPROVED_CREDENTIAL_SENTINEL|independently verified|<img\b|<form\b|<input\b|application\/ld\+json/);
  for (const [file, marker] of [["services/index.html", "data-practitioner-teaser"], ["services/love/qa-profile-service/index.html", "data-practitioner-link"]]) {
    const html = fs.readFileSync(path.join(fixture, "dist", file), "utf8");
    assert.ok(html.includes(marker)); assert.ok(html.includes('href="/services/practitioner/"'));
  }
  await startBrowser();
  for (const width of [375, 768, 1024, 1280, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: origin + "/services/practitioner/" });
    await waitFor(() => evaluate('document.readyState === "complete" && !!document.querySelector("[data-practitioner-page]")'), "profile page");
    await evaluate('document.fonts.ready.then(()=>true)');
    const data = await evaluate(`(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: [...document.querySelectorAll('h1')].map(h=>h.textContent),
      h2: [...document.querySelectorAll('[data-practitioner-page] h2')].map(h=>h.textContent),
      title: document.title, description: document.querySelector('meta[name=description]').content,
      robots: document.querySelector('meta[name=robots]').content, canonical: !!document.querySelector('link[rel=canonical]'),
      breadcrumb: document.querySelector('[aria-label=Breadcrumb] a').getAttribute('href'),
      current: document.querySelector('[aria-label=Breadcrumb] [aria-current=page]').textContent,
      bodyWidth: document.querySelector('.practitioner-page__body').getBoundingClientRect().width,
      forbidden: /PRIVATE_VERIFICATION_SENTINEL|UNVERIFIED_CLAIM_SENTINEL|UNAPPROVED_CREDENTIAL_SENTINEL/.test(document.body.textContent),
      schema: document.querySelectorAll('script[type="application/ld+json"]').length,
      targets: [...document.querySelectorAll('[data-practitioner-page] a')].map(a=>{const r=a.getBoundingClientRect();return r.height>=44 && r.width>=44;})
    }))()`);
    assert.equal(data.overflow, false); assert.deepEqual(data.h1, ["The practitioner"]);
    assert.deepEqual(data.h2, ["Background", "Practice history", "Disciplines & traditions", "Training & initiations", "Kinds of work", "Selected work & writings", "Approach & ethics"]);
    assert.equal(data.title, "The Practitioner — Services | Mystagogia"); assert.equal(data.description, profile.summary.text);
    assert.equal(data.robots, "noindex, nofollow"); assert.equal(data.canonical, false);
    assert.equal(data.breadcrumb, "/services/"); assert.equal(data.current, "The practitioner");
    assert.ok(data.bodyWidth <= 720); assert.equal(data.forbidden, false); assert.equal(data.schema, 0); assert.ok(data.targets.every(Boolean));
    const ax = await send("Accessibility.getFullAXTree");
    assert.ok(ax.result.nodes.some(n=>!n.ignored && n.role?.value === "heading" && n.name?.value === "The practitioner" && n.properties?.some(p=>p.name === "level" && p.value?.value === 1)));
    await send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await evaluate("document.querySelector('[aria-label=Breadcrumb] a').focus()");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    assert.match(await evaluate("document.activeElement.textContent"), /Return to Services/);
    assert.ok(await evaluate("parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3"));
    await capture(`services-practitioner-${width}.png`, width);
    await evaluate("document.querySelector('.practitioner-page__body a').focus()");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await waitFor(() => evaluate('location.pathname === "/services/" && !!document.querySelector("[data-practitioner-teaser]")'), "hub return and gated teaser");
    assert.equal(await evaluate("document.querySelector('[data-practitioner-teaser] a').getAttribute('href')"), "/services/practitioner/");
    assert.ok((await fetch(origin + "/services/practitioner/")).ok);
    console.log(`PASS: profile@${width}: biography/resume blocks, private/unverified omission, heading/metadata, reading width, keyboard, working conditional links`);
  }
  // Minimal approved biography must not display empty résumé/credential headings.
  source({ status: "published", approved: true, summary: profile.summary, biography: profile.biography });
  cleanBuild();
  const minimal = fs.readFileSync(path.join(fixture, "dist/services/practitioner/index.html"), "utf8");
  assert.doesNotMatch(minimal, /id="practitioner-(history|disciplines|training|work|writings|principles)"/);
  assert.match(minimal, /id="practitioner-biography"/);
  // A real ancestor module is required even with a fully approved source.
  fs.rmSync(path.join(fixture, "src/pages/services/[...index].astro"));
  cleanBuild();
  assert.equal(fs.existsSync(path.join(fixture, "dist/services/practitioner/index.html")), false);
  console.log("PASS: approved profile visibility and draft/missing-hub exclusion, optional blocks omitted, no public invented identity or credential");
} finally { await close(); }
