var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category.js'); //引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型
var Category = mongoose.model('Category', CategorySchema);

// 将movie模型[构造函数]导出
module.exports = Category;