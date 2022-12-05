const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const fs = require('fs')

const index = require('./routes/index')
const users = require('./routes/users')

// 错误处理
onerror(app)

// 中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 使用模板引擎pug
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 使用html页面
// app.use(ctx => { 
//   ctx.response.type = 'html'
//   ctx.response.body=fs.createReadStream('./index.html') 
// })

// 日志记录
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 路由方法
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// 错误处理器
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app