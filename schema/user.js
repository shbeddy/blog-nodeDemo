const {Schema} = require('./config')

const UserSchema = new Schema({
    username: String,
    password: String,
    role:{
        type:String,
        default: 1
    },
    avatar: {
        type: String,
        default: '/avatar/default.jpg'
    },
    articleNum: Number,
    commentNum: Number
}, {versionKey: false})

UserSchema.post('remove', (doc)=>{
    const Comment = require('../modules/comment')
    const Article = require('../modules/article')
    const {_id} = doc
    console.log(doc);

    Comment
    .find({from: _id})
    .then(data=>{
        data.forEach(v=>v.remove())
    })
    Article
    .find({author: _id})
    .then(data =>{
        data.forEach(v=>v.remove())
    })
})
module.exports = UserSchema