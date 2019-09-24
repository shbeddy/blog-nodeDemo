const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const body = require('koa-body')
const {join} = require('path')
const session = require('koa-session')
const router = require('./router')

// 生成koa实例
const app = new Koa

app.keys = ["这是密钥"]

const CONFIG = {
    key: 'sid',
    maxAge: 6e5,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true
}

// 注册日志模板
// app.use(logger())

// 注册session
app.use(session(CONFIG, app))

// 配置koa-body 处理post请求数据
app.use(body())

// 配置静态资源目录
app.use(static(join(__dirname, 'public')))

// 配置视图模板目录
app.use(views(join(__dirname, 'views'), {
    extension: 'pug'
}))



app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, ()=>{
    console.log('启动成功,监听在3000端口...');
})

// 创建管理员用户, 如果已创建则返回
{
    const {db} = require('./schema/config')
    const UserSchema = require('./schema/user')
    const encrypt = require('./util/encrypt')

    const User = db.model('users', UserSchema)

    User
    .find({username: 'admin'})
    .then((data)=>{
        if(data.length === 0){
            new User({
                username: 'admin',
                password: encrypt('admin'),
                role: 666,
                commentNum: 0,
                articleNum: 0
            })
            .save()
            .then(data=>data)
            .catch(err=>{
                console.log('管理员权限检测失败');
            })
        }
    })
        
}