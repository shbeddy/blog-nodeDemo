const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const {join} = require('path')
const router = require('./router')

const app = new Koa

app.use(logger())

app.use(static(join(__dirname, 'public')))

app.use(views(join(__dirname, 'views'), {
    extension: 'pug'
}))



app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, ()=>{
    console.log('启动成功,监听在3000端口...');
})

