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
  const seen = new Set()
  const results = []
  for (const el of document.querySelectorAll('[class]')) {
    const cls = (el.getAttribute('class')||'').split(' ').find(c=>c.startsWith('css-'))
    if (!cls) continue
    if (seen.has(cls)) continue
    seen.add(cls)
    const mui = (el.getAttribute('class')||'').split(' ').filter(c=>c.startsWith('Mui')).join(' ').replace(/MuiInputLabel-(animated|formControl|sizeSmall|standard|colorPrimary|root)/g,'')
    results.push({ cls, tag: el.tagName, mui: mui.slice(0,80), font: getComputedStyle(el).fontFamily.split(',')[0] })
  }
  return results
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
