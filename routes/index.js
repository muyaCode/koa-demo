const router = require('koa-router')()

// 路由文档：https://github.com/koajs/router/blob/HEAD/API.md

router.get('/', async (ctx, next) => {
  // ctx.render() 是app.js里模板渲染的koa-view库注入的方法，koa-view文档：https://www.npmjs.com/package/koa-view#viewroot-opts
  await ctx.render('index', 
    // 传递对象可以直接在：views/index.pug使用，[h1= title]
    {
      title: 'Hello Koa 2!'
    }
  )
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
