var movie = require('../models/movie.js'); // 载入mongoose编译后的模型movie

//index page
exports.index = function(req,res) {
	console.log('usersession:')
	console.log(req.session.user)//链接到数据库的时候可直接读取，req相当于是公有的，都是请求时带入的信息。
	movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title: 'node 首页',
			movies: movies
		})
	})
}
