import { readFileSync, writeFileSync } from 'node:fs'
const tokens = JSON.parse(readFileSync(new URL('../design-system/tokens.json', import.meta.url), 'utf8'))
const declarations = []
for (const group of ['color', 'spacing', 'radius', 'shadow', 'size']) {
  for (const token of tokens[group].tokens) {
    declarations.push(`  --${token.name}: ${typeof token.value === 'object' ? token.value.light : token.value};`)
  }
}
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), `/* Gerado de design-system/tokens.json por scripts/sync-tokens.mjs. */\n:root {\n${declarations.join('\n')}\n  --font-sans: ${tokens.type.families.sans};\n  --font-display: ${tokens.type.families.display};\n}\n`)
