var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段
var movie = require('../models/movie.js')
var comment =require('../models/comment.js')
var Category = require('../models/category.js')
//两个文件读取模块
var fs = require('fs')
var path = require('path')
//detail page
exports.detail = function(req,res) {
	var id = req.params.id
    movie.update({_id:id},{$inc:{pv:1}},function(err){
        if(err){
            console.log(err)
        }
    })
    //获取comment的方式1，回调的方式，先查找到movie，再查找comment
	 movie.findById(id,function(err,movie){
        //注意：用于在schema中已经直接关联了user这张表，所以只要使用populate方法就是直接在user中进行查找，这里做的工作是对目标对象进行填充；
        comment
            .find({movie: id})
            .populate({path:'from',select:'name'})//这里自动将from的值付给了_id，因为path是让数据库根据这个from来寻找值的，from是在user这张表中寻找数据的依据，而from在user表中是作为_id存在的
            .populate('reply.from reply.to', 'name')
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
//admin poster
exports.savePoster = function(req,res,next){
    //这里的req.files是经过multipart这个中间件处理后的文件形式

    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    console.log(req.files)
    var originalFilename = posterData.originalFilename
    //这种上传文件的写法速度回比较慢，可以采取异步上传文件的办法（记一下），不是用中间
    if(originalFilename) {
        fs.readFile(filePath,function(err,data){
            //data为读取到的文件数据
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' +type
            var newPath = path.join(__dirname,'../../','/public/upload/' +poster)

            fs.writeFile(newPath,data,function(err){
                req.poster = poster
                next()
            })
        })
    }else{
        next()
    }
}
// admin post movie 后台录入提交
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if(req.poster){
        movieObj.poster = req.poster
    }
    if (id) { // 已经存在的电影数据,这个数据应该是在表中给到的。
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
      /*  _movie = new movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
            category:movieObj.category
        });*/
        //这里遇到的问题，视频讲解时传过来的movieObj.category是一个数组，与schema中定义的对象不符合，所以造成报错，所以将admin.jade中的input框做了改装
       _movie = new movie(movieObj)
       var categoryId = _movie.category
       _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            Category.findById(categoryId,function(err,category){
                category.movies.push(movie._id)
                category.save(function(err,category){
                    res.redirect('/movie/' + movie._id);
                })
            })
        });
    }
}
// admin update movie 后台更新页
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        movie.findById(id, function (err, movie) {
            Category.find({},function(err,categories){
                res.render('admin', {
                    title: 'imovie 后台更新页',
                    movie: movie,
                    categories: categories
                });
            })         
        });
    }
}
//admin page
exports.new = function(req,res) {
    Category.find({},function(err,categories){
        res.render('admin',{
            title: '录入页',
            categories:categories,
            movie:{}
        })
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
