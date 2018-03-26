var Comment = require('../models/comment.js')

//comment
exports.save = function(req,res) {
	var _comment = req.body.comment
    var movieId = _comment.movie
    //因为在schema里面已经定义好了表结构，这里调用new Comment方法可以直接将comment中的数据填充到定义的表结构中，有数据的才填充
    var comment = new Comment(_comment)

    comment.save(function(err,comment){
        if(err) {
            console.log(err)
        }
        res.redirect('/movie/' +movieId)
    })
}

