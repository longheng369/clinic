import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
const base = 'http://127.0.0.1:8000'
await page.goto(base + '/login', { waitUntil: 'networkidle2', timeout: 30000 })
await page.type('#email', 'test@example.com')
await page.type('#password', 'testpass123')
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(()=>{}), page.click('button[type="submit"]')])
await page.goto(base + '/medicines', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise((r)=>setTimeout(r,800))
await page.evaluate(() => { [...document.querySelectorAll('button')].find(b=>b.textContent.includes('New Medicine'))?.click() })
await new Promise((r)=>setTimeout(r,1500))

const out = await page.evaluate(() => {
  const tags = [...document.querySelectorAll('style[data-emotion]')]
  const target = ['css-1x351wq', 'css-1pr9nav', 'css-1ob4rtt', 'css-1aso48g', 'css-1eukkp6', 'css-1wd3yy0', 'css-cmpglg']
  const hits = {}
  for (const t of target) hits[t] = []
  for (const [i, s] of tags.entries()) {
    for (const t of target) {
      const idx = s.textContent.indexOf('.' + t)
      if (idx !== -1) {
        const seg = s.textContent.slice(idx, idx + 260)
        const ff = (seg.match(/font-family:[^;]+/) || [''])[0]
        hits[t].push({ tagIdx: i, emotion: s.getAttribute('data-emotion'), ff })
      }
    }
  }
  return hits
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
