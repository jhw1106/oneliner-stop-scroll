// One Line to Stop the Scroll — entry program.
//
// Writes a single original line of text to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). The line must be 1-200 characters and non-blank;
// anything else fails loudly so a bad entry never ships silently.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Hey — you made it through every hard day so far, 100% success rate, and that's worth a smile.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

const chars = [...LINE].length;
if (LINE.trim().length === 0) {
  throw new Error("entry line is blank");
}
if (chars < 1 || chars > 200) {
  throw new Error(`entry line is ${chars} characters, must be 1-200`);
}

// The gate counts characters, but the leaderboard ranks ties by bytes, so
// keep the payload lean: refuse anything over 200 UTF-8 bytes as well.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes > 200) {
  throw new Error(`entry line is ${bytes} bytes, must be at most 200`);
}

// Exactly one line: no newline inside, and no trailing newline in the file,
// so the entry is byte-for-byte the line and nothing else.
if (LINE.includes("\n")) {
  throw new Error("entry line must not contain a newline");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");
console.log(`wrote ${chars} characters to ${outFile}`);
