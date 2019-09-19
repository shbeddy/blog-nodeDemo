const Router = require('koa-router')

const router = new Router

router.get('/', async (ctx) =>{
    await ctx.render('index', {
        title: '首页', 
    })
})
// router.get('/user/:id', async (ctx)=>{
//     ctx.body = ctx.params.id
// })
router.get(/^\/user\/(?=reg|login)/, async (ctx)=>{
    // show为true则显示注册,否则显示登录
    const show = /reg$/.test(ctx.path)
    // 渲染
    await ctx.render('register', {show})
})

module.exports = router