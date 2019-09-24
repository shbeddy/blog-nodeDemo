// 连接数据库 导出db schema
const mongoose = require('mongoose')
const db = mongoose.createConnection(
    'mongodb://localhost:27017/blogproject', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
const Schema = mongoose.Schema

// 挂载原生promise
mongoose.Promise = global.Promise

db.on('error', ()=>{
    console.log('数据库链接失败');
})
db.on('open', ()=>{
    console.log('blogproject数据库连接成功...');
})

module.exports = {
    db,
    Schema
}