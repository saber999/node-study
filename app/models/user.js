var mongoose = require('mongoose');
var UserSchema = require('../schemas/user.js'); //引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型
var User = mongoose.model('User', UserSchema);

// 将movie模型[构造函数]导出
module.exports = User;