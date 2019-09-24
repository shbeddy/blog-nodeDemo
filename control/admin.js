const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
const UserSchema = require('../schema/user')
const CommentSchema = require('../schema/comment')

// 通过db对象创建操作article数据库的模型对象
const Article = db.model('articles', ArticleSchema)
const User = db.model('users', UserSchema)
const Comment = db.model('comments', CommentSchema)

const fs = require('fs')
const {join} = require('path')

exports.index = async ctx =>{
    if(ctx.session.isNew){
        ctx.status = 404
        return await ctx.render('404', {title: '404'})
    }
    const id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname, '../views/admin'))
    let flag = false

    arr.forEach(v =>{
        const name = v.replace(/^(admin\-)|(\.pug)$/g, '')
        if(name === id){
            flag = true
        }
    })
    if(flag){
        await ctx.render('./admin/admin-' + id, {
            role: ctx.session.role
        })
    }else{
        ctx.atatus = 404
        await ctx.render('404', {title: '404'})
    }
}














