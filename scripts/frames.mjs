// Captures the emblem region at several moments to judge animated shaders.
import { chromium } from 'playwright'
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
for (let i = 0; i < 3; i++) {
  await p.waitForTimeout(i === 0 ? 3500 : 2500)
  await p.screenshot({ path: `screenshots/frame${i}.png`, clip: { x: 840, y: 260, width: 480, height: 360 } })
}
await b.close()
