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

const rules = await page.evaluate(() => {
  const out = []
  for (const sheet of document.styleSheets) {
    let cssRules
    try { cssRules = [...sheet.cssRules] } catch { continue }
    const scan = (list, prefix='') => {
      for (const r of list) {
        if (r.cssRules) scan(r.cssRules, prefix)
        else if (r.selectorText && /MuiInputLabel|MuiSelect-select|MuiSelect-root|MuiMenuItem|MuiFormLabel/.test(r.selectorText)) {
          if (/font/.test(r.style.cssText)) out.push({ sel: r.selectorText, css: r.style.cssText.slice(0,200), href: sheet.href })
        }
      }
    }
    scan(cssRules)
  }
  return out
})
console.log(JSON.stringify(rules, null, 2))
await browser.close()
