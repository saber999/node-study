var express =  require('express')//引入express框架
var port = process.env.PORT || 3000//设置端口号，其中process.env是设置环境端口号，没有设置的情况下就是3000
var mongoose = require('mongoose')
var connect =require('connect')
var fs = require('fs')

var app = express()//node的express框架,启动web服务，由express封装好
var dburl = 'mongodb://localhost:27017/moive'

mongoose.connect(dburl)
//models loading通过mongoose.model('user')可以拿到user
var models_path = __dirname + '/app/models/'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
      	//正则js文件或coffee文件
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)//继续遍历
      }
    })
}
walk(models_path)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
 
app.locals.moment = require('moment'); // 载入moment模块，格式化日期

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))//格式化表单数据,这条尤其重要

var serveStatic = require('serve-static')  // 静态文件处理
app.use(serveStatic('public')) // 路径：bower_components，让其请求静态资源的时候自动加上bower_components

var cookieParser = require('cookie-parser')
app.use(cookieParser())
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)//将session存入数据库
//引入处理文件上传的中间件
var multipart = require('connect-multiparty')
app.use(multipart())

app.use(session({
	secret:'movie',//secret的值建议使用随机字符串
	store : new mongoStore({
	  url : dburl,
	  collection : 'sessions'//任意取得名字
	})
}))

var morgan = require('morgan')
//以下配置是为了开发的时候更方便调试；
if ('development' === app.get('env')){
	app.set('showStackError', true)
	app.use(morgan(':method:url :status'))
	app.locals.pretty=true//增加源码可读性
	mongoose.set('debug', true)
}
//设置跨域，采坑，跨域设置要在引入路由之前。因为访问接口最终还是通过路由
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
   /* res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");*/
    next();
});
require('./config/routes')(app)

//cookie一般是客户端使用，session用于服务器端，当服务器重启后，session也会被清空
app.listen(port)
console.log('this is a project '+port)

/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */


