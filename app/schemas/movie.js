var mongoose = require('mongoose');

//相当于是定义表结构
var movieSchema = new mongoose.Schema({
    title: String,
    doctor: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    // meta 更新或录入数据的时间记录
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        },
    }
});

// movieSchema.pre 表示每次存储数据之前都先调用这个方法,这里的this.isNew暂时没有搞清楚，先记住，这里存数据经常这样处理
movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();//将流程进行下去
});

// movieSchema 模式的静态方法
movieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)//输出查询到的数据，cb是callback的缩写
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

// 导出movieSchema模式
module.exports = movieSchema;

