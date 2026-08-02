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
  const found = []
  const walk = (list) => {
    for (const r of list) {
      if (r.cssRules) walk(r.cssRules)
      else if (r.selectorText && r.style.cssText && r.style.cssText.includes('Roboto')) {
        found.push({ sel: r.selectorText, css: r.style.cssText.slice(0,300) })
      }
    }
  }
  for (const sheet of document.styleSheets) {
    try { walk([...sheet.cssRules]) } catch {}
  }
  // also check inline styles on the label/select
  const label = document.querySelector('.MuiInputLabel-root')
  const sel = document.querySelector('.MuiSelect-select')
  return {
    roboRules: found,
    labelInline: label?.getAttribute('style'),
    selectInline: sel?.getAttribute('style'),
    labelOuterHTML: label?.outerHTML.slice(0, 300),
    selectOuterHTML: sel?.outerHTML.slice(0, 300),
  }
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
