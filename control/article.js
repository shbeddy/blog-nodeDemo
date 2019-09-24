const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
const UserSchema = require('../schema/user')
const CommentSchema = require('../schema/comment')

// 通过db对象创建操作article数据库的模型对象
const Article = db.model('articles', ArticleSchema)
const User = db.model('users', UserSchema)
const Comment = db.model('comments', CommentSchema)

// 返回文章发表页面
exports.addPage = async (ctx)=>{
    await ctx.render('add-article', {
        title: '文章发表',
        session: ctx.session
    })
}

// 返回新增文章
exports.add = async (ctx) => {
    if(ctx.session.isNew){  //用户未登录  直接返回 
        return ctx.body = {
            msg: '用户未登录',
            status: 0
        }
    }
    const data = ctx.request.body
    data.author = ctx.session.uid
    data.commentNum = 0

    await new Promise((resolve, reject)=>{
        new Article(data).save((err, data)=>{
            if(err) return reject(err)
            User.update(    //更新用户文章计数
                {_id: data.author},
                {$inc: {articleNum: 1}}, 
                err=>{
                    if(err) console.log(err)
                }
            )
            resolve(data)
        })
    })
    .then((data)=>{
        ctx.bode = {
            msg: '发表成功',
            status: 1
        }
    })
    .catch((err)=>{
        ctx.bode = {
            msg: '发表失败',
            status: 0
        }
    })
}

// 获取文章列表
exports.getList = async ctx =>{
    let page = ctx.params.id || 1
    page--

    const maxNum = await Article.estimatedDocumentCount((err, num)=>err?console.log(err):num)
    const artList = await Article
        .find()
        .sort('-created')
        .skip(10*page)
        .limit(10)
        .populate({ //联表查询
            path: 'author',
            select: 'username _id avatar'
        })
        .then(data=>data)
        .catch(err=>console.log(err))

    await ctx.render('index', {
        title: '博客首页',
        session: ctx.session,
        artList,
        maxNum
    })
}

// 返回文章详情
exports.details = async (ctx) =>{
    const _id = ctx.params.id

    const article = await Article
        .findById(_id)
        .populate('author', 'username')
        .then(data=>data)
        

    const comment = await Comment
        .find({article: _id})
        .sort('-created')
        .populate('from', 'username avatar')
        .then(data=>data)
        .catch(err=>console.log(err))

    await ctx.render('article', {
        title: article.title,
        article,
        comment,
        session: ctx.session
    })
}




