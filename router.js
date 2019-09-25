const Router = require('koa-router')
const user = require('./control/user')
const article = require('./control/article')
const comment = require('./control/comment')
const admin = require('./control/admin')
const upload = require('./util/upload')

const router = new Router

router.get('/', user.keepLog, article.getList)
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

// 处理用户注销
router.get('/user/logout', user.logout)

// 处理文章发表页面
router.get('/article', user.keepLog, article.addPage)

// 处理文章发表添加
router.post("/article", user.keepLog, article.add)

// 文章列表 分页
router.get('/page/:id', article.getList)

// 文章详情
router.get('/article/:id', user.keepLog, article.details)

// 发表评论
router.post("/comment", user.keepLog, comment.save)

// 后台管理
router.get('/admin/:id', user.keepLog, admin.index)

// 头像上传功能
router.post('/upload', user.keepLog, upload.single('file'), user.upload)

// 获取用户评论列表
router.get('/user/comments', user.keepLog, comment.comList)

// 删除评论
router.del('/comment/:id', user.keepLog, comment.del)

// 获取用户文章列表
router.get('/user/articles', user.keepLog, article.artList)

// 删除文章
router.del('/article/:id', user.keepLog, article.del)

// 获取用户列表(管理员权限)
router.get('/user/users', user.keepLog, user.userList)

// 删除用户(管理员权限)
router.del('/user/:id', user.keepLog, user.del)



router.get('*', async ctx=>{
    await ctx.render('404', {
        title: '404'
    })
})

module.exports = router