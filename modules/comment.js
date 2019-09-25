const {db} = require('../schema/config')
const CommentSchema = require('../schema/comment')

const Comment = db.model('comments', CommentSchema)

module.exports = Comment