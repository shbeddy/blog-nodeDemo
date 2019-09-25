const Article = require('../modules/article')
const User = require('../modules/user')
const Comment = require('../modules/comment')

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
            .update(    //更新文章评论计数器
                {_id: data.article}, 
                {$inc:{commentNum: 1}}, 
                (err)=>{if(err)console.log(err)}
            )
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

exports.comList = async ctx =>{
    const uid = ctx.session.uid

    const data = await Comment
    .find({from: uid})
    .populate('article', 'title')

    ctx.body = {
        code: 0,
        conut: data.length,
        data
    }
}

exports.del = async ctx =>{
    const comId = ctx.params.id
    let res = {
        state: 1,
        message: '删除成功'
    }
    await Comment.findById(comId)
    .then(data=>{data.remove()})
    .catch(err=>{
        res = {
            state: 0,
            message: '删除失败'
        }
    })

    ctx.body = res
}

