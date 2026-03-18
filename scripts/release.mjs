/**
 * Publishes only the dist/ output to the `releases` branch.
 * Consumers install via: npm install github:<owner>/<repo>#releases
 *
 * Usage: npm run release
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { mkdtempSync } from "fs";

const root = new URL("..", import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

console.log(`\nReleasing v${pkg.version} → releases branch\n`);

// Create a temp dir to stage the release contents
const tmp = mkdtempSync(join(tmpdir(), "tiptap-release-"));

// Copy dist/ into temp dir
cpSync(join(root, "dist"), join(tmp, "dist"), { recursive: true });

// Write a minimal package.json (no devDependencies, no scripts except version/name/types/main/module)
const releasePkg = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  main: pkg.main,
  module: pkg.module,
  types: pkg.types,
  files: pkg.files,
  dependencies: pkg.dependencies,
  peerDependencies: pkg.peerDependencies,
};
writeFileSync(
  join(tmp, "package.json"),
  JSON.stringify(releasePkg, null, 2) + "\n"
);

// Get the current branch to return to it after
const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: root })
  .toString()
  .trim();

const run = (cmd) => execSync(cmd, { cwd: tmp, stdio: "inherit" });

// Init a fresh git repo in the temp dir pointing at the same remote
const remote = execSync("git remote get-url origin", { cwd: root })
  .toString()
  .trim();

run(`git init`);
run(`git remote add origin ${remote}`);

// Fetch and checkout releases branch if it exists, otherwise create it
try {
  execSync(`git fetch origin releases`, { cwd: tmp, stdio: "pipe" });
  run(`git checkout -b releases origin/releases`);
} catch {
  run(`git checkout --orphan releases`);
}

// Stage all files and commit
run(`git add -A`);

const hasChanges =
  execSync("git status --porcelain", { cwd: tmp }).toString().trim().length > 0;

if (!hasChanges) {
  console.log("Nothing changed since last release.");
  process.exit(0);
}

run(`git commit -m "release: v${pkg.version}"`);
run(`git push origin releases --force`);

console.log(`\nDone! Install with:`);
console.log(
  `  npm install github:${remote.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1]}#releases\n`
);
