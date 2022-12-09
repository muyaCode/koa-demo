const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const fs = require('fs');
const koaStatic = require('koa-static');
// routes路由
const index = require('./routes/index');
const users = require('./routes/users');

// 错误处理
onerror(app);

// body数据 解析中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));

// json数据 解析中间件
app.use(json());

// 日志中间件
app.use(logger());

// html或者其他模板引擎页面访问："/public/stylesheets/style.css"
// 加载静态资源，访问：http://localhost:2333/stylesheets/style.css   
// 访问index.html(默认就是访问index.html，但可以全路径访问)：http://localhost:2333/index.html
app.use(koaStatic(__dirname + '/public'));


// 使用模板引擎pug，如果是ejs，也可以把pug替换成ejs
// views 第一个参数：静态页面的路径 第二个参数配置对象
app.use(views(__dirname + '/views', { extension: 'pug' }));
// 这样配置 模板文件必须要.html结尾
// app.use(views("views", {map: {html: 'ejs'}}));
// 两种配置方法一样 模板文件的后缀名：.ejs
// app.use(views("views", {extension: 'ejs'}));



// 使用html页面
// app.use(ctx => {
//   ctx.response.type = 'html'
//   ctx.response.body = fs.createReadStream('./public/index.html')
// })

// 日志记录
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

/** 
 * 将routes路由对象，挂载到app对象中
 * allowedMethods()方法：router.allowedMethods()用在了路由匹配 router.routes()之后，当所有 路由中间件最后调用.的时候，根据 ctx.status 设置 response 响应头，当请求出错时的处理逻辑
*/
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// 错误处理器
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app