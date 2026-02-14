import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTRACTS_OUT = join(__dirname, "../../../apps/contracts/out");
const ABIS_DIR = join(__dirname, "../src/abis");

const contracts = ["TokenFactory", "BaseToken"];

mkdirSync(ABIS_DIR, { recursive: true });

for (const name of contracts) {
  const artifact = JSON.parse(
    readFileSync(join(CONTRACTS_OUT, `${name}.sol`, `${name}.json`), "utf-8")
  );

  writeFileSync(
    join(ABIS_DIR, `${name}.ts`),
    `export const ${name}Abi = ${JSON.stringify(artifact.abi, null, 2)} as const;\n`
  );

  console.log(`Synced ${name} ABI`);
}

// Generate index file
const exports = contracts
  .map((name) => `export { ${name}Abi } from "./${name}";`)
  .join("\n");

writeFileSync(join(ABIS_DIR, "index.ts"), exports + "\n");

console.log("ABI sync complete!");
