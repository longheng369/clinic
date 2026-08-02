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
  const ruleMap = new Map()
  for (const sheet of document.styleSheets) {
    let rules; try { rules = [...sheet.cssRules] } catch { continue }
    const walk = (list) => { for (const r of list) { if (r.cssRules) walk(r.cssRules); else if (r.selectorText && r.selectorText.startsWith('.css-')) { ruleMap.set(r.selectorText, r.style.fontFamily || '') } } }
    walk(rules)
  }
  const results = []
  const els = document.querySelectorAll('[class*="css-"]')
  for (const el of els) {
    const cls = [...el.classList].find(c => c.startsWith('css-'))
    if (!cls) continue
    const ff = ruleMap.get('.' + cls) || '(no font-family rule)'
    if (ff) results.push({ tag: el.tagName, cls, class: (el.getAttribute('class')||'').split(' ').filter(c=>c.startsWith('Mui')).join(' '), ff })
  }
  return results
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
