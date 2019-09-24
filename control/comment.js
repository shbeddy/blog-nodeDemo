const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
const UserSchema = require('../schema/user')
const CommentSchema = require('../schema/comment')

// 通过db对象创建操作数据库的模型对象
const Article = db.model('articles', ArticleSchema)
const User = db.model('users', UserSchema)
const Comment = db.model('comments', CommentSchema)

exports.save = async ctx =>{
    let message = {
        status: 0,
        msg: '登录才能评论'
    }

    // 验证是否登录
    if(ctx.session.isNew) return ctx.body = message

    const data = ctx.request.body
    data.from = ctx.session.uid

    const comment = new Comment(data)

    await comment
        .save()
        .then(data=>{
            message = {
                status: 1,
                msg: '评论成功'
            }
            Article
            .update({   //更新文章评论计数器
                _id: data.article}, 
                {$inc:{commentNum: 1}}, 
                (err)=>{if(err)console.log(err)})
            User
            .update(   //更新用户评论计数器
                {_id: data.from},
                {$inc:{commentNum: 1}},
                err=>{
                    if(err)console.log(err)
                }
            )
        })
        .catch(err=>{
            message = {
                status: 0,
                msg: '评论失败'
            }
        })

}