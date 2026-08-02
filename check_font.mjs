import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1400, height: 900 },
})

const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[console] ${m.type()}: ${m.text()}`))
page.on('requestfailed', (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`))

const base = 'http://127.0.0.1:8000'

try {
  await page.goto(base + '/login', { waitUntil: 'networkidle2', timeout: 30000 })
  await page.type('#email', 'test@example.com')
  await page.type('#password', 'testpass123')
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ])
  console.log('URL after login:', page.url())

  await page.goto(base + '/medicines', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 1000))

  const hasNewBtn = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    return btns.some((b) => b.textContent.includes('New Medicine'))
  })
  console.log('Found New Medicine button:', hasNewBtn)

  if (hasNewBtn) {
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')]
      btns.find((b) => b.textContent.includes('New Medicine'))?.click()
    })
    await new Promise((r) => setTimeout(r, 1500))
  }

  const results = await page.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el).fontFamily : 'ELEMENT NOT FOUND')
    const body = document.body
    const input = document.querySelector('.MuiInputBase-input')
    const inputRoot = document.querySelector('.MuiInputBase-root')
    const label = document.querySelector('.MuiInputLabel-root')
    const select = document.querySelector('.MuiSelect-select')
    const menuItem = document.querySelector('.MuiMenuItem-root')
    const grid = document.querySelector('.MuiGrid-root')
    const muiTypography = document.querySelector('.MuiTypography-root')
    const tailwindText = document.querySelector('h5, .text-gray-500, p')

    const docs = [...document.styleSheets].map((s) => {
      try { return { href: s.href, rules: [...s.cssRules].length } } catch { return null }
    })

    const emotionStyles = [...document.querySelectorAll('style[data-emotion]')].map((s) => ({
      id: s.getAttribute('data-emotion'),
      len: s.textContent.length,
    }))
    const viteStyles = [...document.querySelectorAll('style')].filter((s) => !s.getAttribute('data-emotion')).map((s) => s.textContent.slice(0, 80))

    return {
      bodyFont: cs(body),
      muiInputFont: cs(input),
      muiInputRootFont: cs(inputRoot),
      muiLabelFont: cs(label),
      muiSelectFont: cs(select),
      muiMenuItemFont: cs(menuItem),
      muiGridFont: cs(grid),
      muiTypographyFont: cs(muiTypography),
      tailwindTextFont: cs(tailwindText),
      docs,
      emotionStyles,
      viteStyles,
    }
  })

  console.log(JSON.stringify(results, null, 2))
  await page.screenshot({ path: '/tmp/opencode/medicines_form.png', fullPage: false })
} catch (e) {
  console.error('ERROR:', e.message)
  console.log('LOGS:\n' + logs.join('\n'))
}

await browser.close()
