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
  const emotion = [...document.querySelectorAll('style[data-emotion]')].map(s=>s.textContent).join('\n')
  const hits = []
  const lines = emotion.split('}')
  for (const l of lines) {
    if (/MuiInputLabel|MuiSelect-select|MuiFormLabel|MuiSelect-root/.test(l) && /font/.test(l)) hits.push(l.slice(-350))
  }
  return { robotoInEmotion: emotion.includes('Roboto'), hits: hits.slice(0,10) }
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
