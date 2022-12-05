// puppeteer爬虫脚本01
const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/cinema/nowplaying/nanning/`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
});

(async () => {
  console.log('Start visit the target page')
  // 运行浏览器
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  // 新建浏览器页面
  const page = await browser.newPage()
  // 去往的页面
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(3000)
  // 选择点击“加载更多”标签
  await page.waitForSelector('#nowplaying .more')

  // 加载更多点击多少次
  // for (let i = 0; i < 2; i++) {
  //   await sleep(3000)
  //   await page.click('.more')
  // }

  // 寻找页面元素
  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-item')
    var links = []

    // 元素的获取和写入数组
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.attr('id')
        let title = it.attr('data-title')
        let rate = it.attr('data-score')
        let poster = it.find('.poster img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  console.log('result',result)
  browser.close()

  // Node进程：运行命令文件：node server/task/movie.js  |  node server/crawler/trailer-list.js
  process.send({ result })
  process.exit(0) // 进程退出
})()
