const router = require('koa-router')()

// 路由文档：https://github.com/koajs/router/blob/HEAD/API.md

// 定义路由的前缀：/users
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'users路由'
})
// 
router.post('/', (ctx, next) => {
  
})
router.put('/:id', (ctx, next) => {
  
})
router.del('/:id', (ctx, next) => {
  
})
router.all('/:id', (ctx, next) => {
  
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'users/bar 路由'
})

// 设置前缀，和prefix功能差不多，不过它可以设置多个前缀
// router.use('/users', router.routes());
// router.use(['/users', '/admin'], router.routes());

module.exports = router
