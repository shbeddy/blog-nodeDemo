const {db} = require('../schema/config')
const UserSchema = require('../schema/user')
const encrypt = require('../util/encrypt')

// 通过db对象创建操作user数据库的模型对象
const User = db.model('users', UserSchema)


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
                password: encrypt(password)
            })
            _user.save((err, data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data   )
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
    .catch(async ()=>{
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
        }else{
            await ctx.render('isOk', {
                status: '登录成功'
            }) 
        }
    })
    .catch(async ()=>{
        await ctx.render('isOk', {
            status: '登录失败'
        }) 
    })
}


