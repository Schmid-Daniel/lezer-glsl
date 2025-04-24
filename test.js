import { parser } from "./src/parser.js";
import { fileTests } from "@lezer/generator/test";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { argv } from "process";

export function parseTests(dir, filter = (a) => a) {
  for (let file of filter(readdirSync(dir))) {
    console.log("executing " + file);
    let tests = fileTests(readFileSync(join(dir, file), "utf8"), file);
    describe(file, () => {
      for (let { name, run } of tests) it(name, () => run(parser));
    });
  }
}

const fileFilterArg = argv.find((entry) => entry.startsWith("--filter="));

function filter(arr) {
  if (!fileFilterArg) {
    return arr;
  }
  const filesToExecute = fileFilterArg
    .split("=")[1]
    .split(",")
    .map((e) => e.trim());

  return arr.filter((entry) => filesToExecute.includes(entry));
}

parseTests("./test", filter);
