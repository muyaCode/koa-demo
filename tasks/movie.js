// crawler/latest-list.js的爬虫脚本任务进程配置：node server/tasks/movie.js
const cp = require('child_process');
const { resolve } = require('path');
// const mongoose = require('mongoose');
// const Movie = mongoose.model('Movie');

;(async () => {
  console.log('1')
  // 两个页面相同任务，可切换爬取
  // const script = resolve(__dirname, '../crawler/latest-list')
  const script = resolve(__dirname, '../crawler/trailer-list')
  console.log('2')
  const child = cp.fork(script, [])
  console.log('3')
  let invoked = false
  /** 
  * 为子进程注册函数
  */
  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  child.on('message', data => {
    let result = data.result

    console.log('result',result)

    // result.forEach(async (item) => {
    //   let movie = await Movie.findOne({
    //     doubanId: item.doubanId
    //   }).exec()

    //   if (!movie) {
    //     movie = new Movie(item)
    //     await movie.save()
    //   }
    // })
  })
})()