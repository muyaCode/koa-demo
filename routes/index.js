const router = require('koa-router')()

// 路由文档：https://github.com/koajs/router/blob/HEAD/API.md

router.get('/', async (ctx, next) => {
  // ctx.render() 是使用app.use(views())模板渲染的koa-view库注入的用于传递要渲染的数据方法
  // koa-view文档：https://www.npmjs.com/package/koa-view#viewroot-opts
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


/**
 * router方法使用实例
 */
// router.get('/', function (ctx, next) {
//   ctx.body = 'users路由'
// })
// // 
// router.post('/', (ctx, next) => {
  
// })
// router.put('/:id', (ctx, next) => {
  
// })
// router.del('/:id', (ctx, next) => {
  
// })
// router.all('/:id', (ctx, next) => {
  
// });

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'users/bar 路由'
// })

// 设置前缀，和prefix功能差不多，不过它可以设置多个前缀
// router.use('/users', router.routes());
// router.use(['/users', '/admin'], router.routes());

module.exports = router
