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
  const tags = [...document.querySelectorAll('style[data-emotion]')].map((s, i) => ({
    i, id: s.getAttribute('data-emotion'), src: s.getAttribute('data-s') || '',
    len: s.textContent.length,
    roboto: s.textContent.includes('Roboto'),
    poppins: s.textContent.includes('Poppins'),
  }))
  // which class does the select root carry?
  const selectRoot = document.querySelector('.MuiSelect-select')?.closest('.MuiInputBase-root')
  const selectClass = selectRoot?.className
  return { tags, selectClass }
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
