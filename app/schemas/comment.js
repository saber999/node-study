var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId//ObjectId就是_id,很难重复,mongoose里面默认生成的主键id
//相当于是定义表结构
var commentSchema = new mongoose.Schema({
    movie:{type:ObjectId, ref:'movie'},//这里的字段与form表单提交上来的字段需要是一致的，不然会无法填充数据，通过关联的field查找数据
    from:{type:ObjectId, ref:'User'},//（注意这里关联另一张表的时候，对应的name为在model中实例化的name）；这里的ref是在设置field时关联另一个schema，在获取document的时候就可以使用populate（）功能通过关联schema的field找到关联的另一个document。
    reply:[{
        from:{type:ObjectId, ref:'User'},
        to:{type:ObjectId, ref:'User'},
        content:String
    }],
    to:{type:ObjectId, ref:'User'},
    content:String,
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

// commentSchema.pre 表示每次存储数据之前都先调用这个方法,这里的this.isNew暂时没有搞清楚，先记住，这里存数据经常这样处理
commentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();//将流程进行下去
});

// commentSchema 模式的静态方法
commentSchema.statics = {
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
module.exports = commentSchema;

