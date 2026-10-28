/**
 * Fast, reusable unit regression runner.
 *
 * Imports the same existing tests in one Node/TypeScript-stripping process
 * rather than spawning 11 separate npm and Node processes on every push.
 * Each test remains independently runnable with its test:* script.
 */
const tests = [
  "test-editorial-schema.mjs",
  "test-editorial-qa.mjs",
  "test-editorial-presentation.mjs",
  "test-editorial-archive.mjs",
  "test-grimoire-archive.mjs",
  "test-article-toc.mjs",
  "test-article-references.mjs",
  "test-editorial-related.mjs",
  "test-media-registry.mjs",
  "test-media-display.mjs",
  "test-media-files.mjs",
];

const started = performance.now();
for (const test of tests) {
  const start = performance.now();
  console.log(`Running ${test}`);
  await import(`./${test}`);
  console.log(`  completed in ${((performance.now() - start) / 1000).toFixed(2)}s`);
}
console.log(`PASS: ${tests.length} unit suites in one process (${((performance.now() - started) / 1000).toFixed(2)}s)`);
