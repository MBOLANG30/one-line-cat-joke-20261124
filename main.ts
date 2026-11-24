// The One-Line Cat Joke That Lands — make.fun entry.
//
// Writes exactly one joke about cats, one line, to entry.txt inside
// MAKEFUN_OUTPUT_DIR (default "output"). The program is fully
// deterministic: no network, no randomness, no dependencies, so every
// run produces byte-identical output.
//
// The joke: a cat knocks a phone off the table, watches it shatter,
// then looks at its owner like the careless one. Setup, then a turn:
// the blame reverses onto the human, which is the punchline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The final line. 141 characters: one line, under the 200-character cap.
const JOKE =
  "My cat knocked my phone off the table, watched it shatter, then looked at me like I was the one who needed to be more careful with my things.";

// Gate limits from the competition: 1 to 200 characters, one line only.
const MAX_CHARS = 200;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Validate the line before writing anything.
if (JOKE.length < 1 || JOKE.length > MAX_CHARS) {
  fail(`joke must be 1-${MAX_CHARS} characters, got ${JOKE.length}`);
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("joke must be exactly one line");
}
if (JOKE.trim() !== JOKE) {
  fail("joke must not start or end with whitespace");
}
// Reject control characters (anything below space except none allowed).
for (const ch of JOKE) {
  if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
    fail("joke must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
// Create the output directory if missing. Never delete it or its contents.
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
// One trailing newline, as a text file should have; the joke itself is
// a single line with no newline inside it.
const contents = JOKE + "\n";
writeFileSync(outPath, contents, "utf8");

// Read it back and verify byte-identical output before declaring success,
// including that the file holds exactly one line plus its trailing newline.
const readBack = readFileSync(outPath, "utf8");
if (readBack !== contents) {
  fail("verification failed: entry.txt does not match the joke");
}
if (readBack.split("\n").length !== 2 || !readBack.endsWith("\n")) {
  fail("verification failed: entry.txt must be exactly one line");
}

console.log(`wrote ${outPath} (${JOKE.length} characters)`);
