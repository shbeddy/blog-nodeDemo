const multer = require('koa-multer')
const {join} = require('path')

const storage = multer.diskStorage({
    // 配置文件储存位置
    destination: join(__dirname, '../public/avatar'),
    // 配置文件名
    filename(req ,file, cb){
        const filename = file.originalname.split(".")
        cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
    }
})

module.exports = multer({storage})