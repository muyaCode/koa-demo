const router = require('koa-router')();
const DB = require('../../module/db.js');

// 路由文档：https://github.com/koajs/router/blob/HEAD/API.md

// 定义路由的前缀：/users
router.prefix('/users')


// 显示用户信息
router.get('/',async (ctx)=>{

  let result = await DB.find('user',{});

  console.log(result);
  await ctx.render('index',{
      list: JSON.stringify(result)
  });
})

// 增加用户
router.get('/add',async (ctx)=>{
  await ctx.render('add');
})


// 执行增加用户的操作
router.post('/doAdd',async (ctx)=>{

  // 获取表单提交的数据

  // console.log(ctx.request.body);  //{ username: '王麻子', age: '12', sex: '1' }

  let data = await DB.insert('user',ctx.request.body);
  //console.log(data);
  try{
      if(data.result.ok){
          ctx.redirect('/')
      }
  }catch(err){
      console.log(err);
      return;
      ctx.redirect('/add');
  }
})

// 编辑用户
router.get('/edit',async (ctx)=>{
  // 通过get传过来的id来获取用户信息
  let id = ctx.query.id;

  let data = await DB.find('user',{"_id":DB.getObjectId(id)});

  // 获取用户信息
  await ctx.render('edit',{
      list:data[0]
  });

})


router.post('/doEdit',async (ctx)=>{
  // 通过get传过来的id来获取用户信息
  // console.log(ctx.request.body);

  var id = ctx.request.body.id;
  var username = ctx.request.body.username;
  var age = ctx.request.body.age;
  var sex = ctx.request.body.sex;

  let data = await DB.update('user',{"_id":DB.getObjectId(id)},{
      username,age,sex
  })

  try{
      if(data.result.ok){
          ctx.redirect('/')
      }
  }catch(err){
      console.log(err);
      return;
      ctx.redirect('/');
  }

})


// 删除用户
router.get('/delete',async (ctx)=>{

  let id = ctx.query.id;

  var data = await DB.remove('user',{"_id":DB.getObjectId(id)});
  console.log(data);
  if(data){
      ctx.redirect('/')
  }
})

module.exports = router
