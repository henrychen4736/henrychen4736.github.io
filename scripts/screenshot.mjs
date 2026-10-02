// Usage: node scripts/screenshot.mjs [url] [outDir]
// Captures desktop + mobile screenshots (WebGL via SwiftShader) for design review.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:5173/'
const out = process.argv[3] ?? 'screenshots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const shots = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true },
]
for (const s of shots) {
  const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.deviceScaleFactor ?? 1, isMobile: s.isMobile })
  page.on('console', (m) => m.type() === 'error' && console.log(`[${s.name}] console:`, m.text()))
  page.on('pageerror', (e) => console.log(`[${s.name}] pageerror:`, e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: `${out}/${s.name}.png` })
  console.log(`saved ${out}/${s.name}.png`)
  await page.close()
}
await browser.close()
