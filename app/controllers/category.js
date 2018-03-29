var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段
var Category = require('../models/category.js')
// admin post movie 后台录入提交
exports.new = function (req, res) {
    res.render('categoryAdmin',{
        title:'电影后台分类录入页',
        category:{}
    })
}
//admin page
exports.save = function(req,res) {
	var _category = req.body.category
    var category = new Category(_category)
    category.save(function(err,category){
        if(err){
            console.log(err)
        }
        res.redirect('/admin/category/list')
    })
}
exports.list = function(err,res){
    Category.fetch(function(err,categories){
        if(err){
            console.log(err)
        }
        res.render('categorylist',{
            title:'分类列表页',
            categories:categories
        })
    })
}
