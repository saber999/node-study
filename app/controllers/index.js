var movie = require('../models/movie.js'); // 载入mongoose编译后的模型movie
var Category = require('../models/category.js')
//index page
exports.index = function(req,res) {
	console.log('usersession:')
	console.log(req.session.user)//链接到数据库的时候可直接读取，req相当于是公有的，都是请求时带入的信息。
	Category
		.find({})
		.populate({path:'movies',options:{limit:5}})
		.exec(function(err,categories){
			if(err){
				console.log(err)
			}
			res.render('index',{
				title: 'node 首页',
				categories: categories
			})
		})
}
exports.search = function(req,res) {
	var catId = req.query.cat
	var page = parseInt(req.query.p, 10) || 0
	var count = 2
	var index = page *count 
	var q = req.query.q
	if(catId){
		Category
			.find({_id:catId})
			//这里populate会自动判断movies的类型，并将title和poster两个字段放到每一个元素中
			//.populate({path:'movies',select:'title poster',options:{limit:2,skip:index}})//skip从那条开始查
			.populate({path:'movies',select:'title poster'})//自己手动分页
			.exec(function(err,categories){
				if(err){
					console.log(err)
				}
				//有一点要注意populate方法后输出的是一个数组
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index+count)
				res.render('result',{
					title: '结果列表页面',
					keyword:category.name,
					currentPage:(page+1),
					query:'cat=' +catId,
					totalPage: Math.ceil(movies.length/count),//math.ceil方法的作用是向上四舍五入
					movies: results
				})
			})
		}else{

			movie
				.find({title:q?new RegExp(q+'.*','i'):''})
				.exec(function(err,movies){
					if(err){
						console.log(err)
					}
					var results = movies.slice(index, index+count)
					res.render('result',{
						title: '结果列表页面',
						keyword:q,
						currentPage:(page+1),
						query:'q=' +q,
						totalPage: Math.ceil(movies.length/count),//math.ceil方法的作用是向上四舍五入
						movies: results
					})
				})
		}
	
}
