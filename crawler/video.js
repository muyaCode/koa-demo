// 爬取电影详情页->爬取预告视频地址
const puppeteer = require('puppeteer')

// https://movie.douban.com/subject/35197639/?from=showing
const base = 'https://movie.douban.com/subject/'
const trailerBase = 'https://movie.douban.com/trailer/'

const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

// https://github.com/GoogleChrome/puppeteer/issues/290
process.on('message', async (movies) => { 
  console.log('开始访问目标页面')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId

    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2'
    })
    await sleep(1000)

    const result = await page.evaluate(() => {
      var $ = window.$
      var it = $('.related-pic-video')

      if (it && it.length > 0) {
        var link = it.attr('href')
        var cover = it.find('img').attr('src')

        return {
          link,
          cover
        }
      }

      return {}
    })

    let video

    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(1000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }

    const data = {
      video,
      doubanId,
      cover: result.cover
    }

    process.send(data)
  }

  browser.close()
  process.exit(0)
})
