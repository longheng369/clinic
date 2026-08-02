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
  const styles = [...document.querySelectorAll('style[data-emotion]')]
  const results = []
  for (const s of styles) {
    const t = s.textContent
    let idx = t.indexOf('Roboto')
    while (idx !== -1) {
      const start = Math.max(0, idx - 400)
      const end = Math.min(t.length, idx + 150)
      results.push({ emotionId: s.getAttribute('data-emotion'), snippet: t.slice(start, end) })
      idx = t.indexOf('Roboto', idx + 1)
      if (results.length > 6) break
    }
  }
  return results
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
