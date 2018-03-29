var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
//相当于是定义表结构
var CategorySchema = new Schema({
    name:String,
    movies:[{type:ObjectId, ref:'movie'}],//这里命名type为bojectId的目的是进行populate查询时，就相当于是在Movie中通过_id查找，而_id在mongodb中是唯一的
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
CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();//将流程进行下去
});

// movieSchema 模式的静态方法
CategorySchema.statics = {
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
module.exports = CategorySchema;

