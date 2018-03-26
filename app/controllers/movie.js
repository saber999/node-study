var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段
var movie = require('../models/movie.js')
var comment =require('../models/comment.js')
//detail page
exports.detail = function(req,res) {
	var id = req.params.id
    //获取comment的方式1，回调的方式，先查找到movie，再查找comment
	 movie.findById(id,function(err,movie){
        //注意：用于在schema中已经直接关联了user这张表，所以只要使用populate方法就是直接在user中进行查找，这里做的工作是对目标对象进行填充；
        comment
            .find({movie: id})
            .populate({path:'from',select:'name'})//这里自动将from的值付给了_id，因为path是让数据库根据这个from来寻找值的，from是在user这张表中寻找数据的依据，而from在user表中是作为_id存在的
            .exec(function(err,comments){
            console.log(comments)
            res.render('detail',{
                title: 'node 详情页',
                movie: movie,
                comments: comments
            })
        })	 	
	 })	
}
//list page
exports.list = function(req,res) {
	
	movie.fetch(function (err, movies) {
	        if (err) {
	            console.log(err);
	        }
	        res.render('list', {
	            title: 'i_movie 列表页',
	            movies: movies
	        });
	    });
}
// admin post movie 后台录入提交
exports.new = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (id !== 'undefined') { // 已经存在的电影数据,这个数据应该是在表中给到的。
        movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            //extend的作用是用movieObj里面的对象覆盖movie里面的字段，而moive是有fetch抓取出来的具有model的特性，故不需要像其他路由一样需要new movie（）
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段,
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {  // 新加的电影
        _movie = new movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
}
// admin update movie 后台更新页
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imovie 后台更新页',
                movie: movie
            });
        });
    }
}
//admin page
exports.save = function(req,res) {
	res.render('admin',{
		title: '录入页',
		movie:{
		title:'',
		doctor:'',
		country:'',
		year:'',
		poster:'',
		flash:'',
		summary:'',
		language:''
	}
	})
}
// list delete movie data 列表页删除电影
exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
}
