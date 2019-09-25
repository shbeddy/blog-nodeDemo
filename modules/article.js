const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')

const Article = db.model('articles', ArticleSchema)

module.exports = Article