const Article = require('../modules/article')
const User = require('../modules/user')
const Comment = require('../modules/comment')

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














