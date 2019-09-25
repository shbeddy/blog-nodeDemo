const Article = require('../modules/article')
const User = require('../modules/user')
const Comment = require('../modules/comment')
const encrypt = require('../util/encrypt')

exports.reg = async (ctx) =>{
    // 获取数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    
    // 查询数据库 当前数据是否存在
    await new Promise((resolve, reject)=>{
        User.find({username}, (err, data)=>{
            if(err) return reject(err)
            if(data.length !== 0){ //查询到数据
                return resolve('')
            } 
            // 未查到数据,需要存储到数据库
            const _user = new User({
                username,
                password: encrypt(password),
                commentNum: 0,
                articleNum: 0
            })
            _user.save((err, data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    })
    .then(async data =>{
        if(data){
            await ctx.render('isOk', {
                status: '注册成功'
            })
        }else{
            await ctx.render('isOk', {
                status: '用户名已存在'
            })
        }
    })
    .catch(async (err)=>{
        await ctx.render('isOk', {
            status: '注册失败,再来一次.'
        })
    })



}

exports.login = async (ctx) =>{
    // 获取数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    await new Promise((resolve, reject)=>{
        User.find({username}, (err, data)=>{
            if(err) return reject(err)
            if(data.length === 0) return reject('用户名不存在')
            if(data[0].password === encrypt(password)){
                return resolve(data)
            }
            resolve('')
        })
    })
    .then(async data=>{
        if(!data){
            return ctx.render('isOk', {
                status: '密码不正确,登录失败'
            })
        }
        // 设置用户cookies
        ctx.cookies.set('username', username, {
            domain: 'localhost',
            path: '/',
            maxAge: 6e5,
            httpOnly: true,
            overwrite: false,
            // signed: true
        })
        ctx.cookies.set('uid', data[0]._id, {
            domain: 'localhost',
            path: '/',
            maxAge: 6e5,
            httpOnly: true,
            overwrite: false,
            // signed: true
        })
        ctx.session = {
            username,
            uid: data[0]._id,
            avatar: data[0].avatar,
            role: data[0].role
        }

        await ctx.render('isOk', {
            status: '登录成功'
        }) 
    })
    .catch(async (err)=>{
        await ctx.render('isOk', {
            status: '登录失败'
        }) 
    })
}

exports.keepLog = async (ctx, next)=>{
    if(ctx.session.isNew){ //session没有值
        if(ctx.cookies.get('username')){
            let uid = ctx.cookies.get('uid')
            let avatar = await User
            .findById(uid)
            .then(data=>data.avatar)
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid,
                avatar
            }
        }
    }

    await next()
}

exports.logout = async (ctx) =>{
    ctx.session = null
    ctx.cookies.set('username', null, {
        maxAge: 0
    })
    ctx.cookies.set('uid', null, {
        maxAge: 0
    })
    ctx.redirect("/")
}

exports.upload = async ctx =>{
    const filename = ctx.req.file.filename

    let data = {}
    await User.update(  //更新数据库
        {_id: ctx.session.uid},     //通过用户id
        {$set:{avatar: '/avatar/'+ filename}}, 
        (err, res)=>{
            if(err){
                data = {
                    status: 0,
                    message: '上传失败'
                }
            }else{
                data = {
                    status: 1,
                    message: '上传成功'
                }
            }
        })

    ctx.body = data
}

exports.userList = async ctx =>{
    const data = await User.find({role: 1})
    ctx.body = {
        code: 0,
        conut: data.length,
        data,
    }
}

exports.del = async ctx =>{
    const uid = ctx.params.id
    let res = {
        state: 1,
        message: '删除成功'
    }

    await User
    .findById(uid)
    .then(data=>data.remove())
    .catch(err=>{
        res = {
            state: 0,
            message: '删除失败'
        }
    })
    ctx.body = res
}