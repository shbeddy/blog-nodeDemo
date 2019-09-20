const Router = require('koa-router')
const user = require('./control/user')

const router = new Router

router.get('/', user.keepLog, async (ctx) =>{
    await ctx.render('index', {
        title: '首页', 
    })
})
// 处理路由 返回登录 注册页面
// router.get('/user/:id', async (ctx)=>{
//     ctx.body = ctx.params.id
// })
router.get(/^\/user\/(?=reg|login)/, async (ctx)=>{
    // show为true则显示注册,否则显示登录
    const show = /reg$/.test(ctx.path)
    // 渲染
    await ctx.render('register', {show})
})

// 处理用户登录 post请求
router.post('/user/login', user.login)

// 处理用户注册
router.post('/user/reg', user.reg)


module.exports = router