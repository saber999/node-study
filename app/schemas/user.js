var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

//相当于是定义表结构
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,//唯一性
        type:String
    },
     password:String,
    //0:normal user
    //1:verified user
    //2: professional user
    //>10:admin
    //>50:super admin
    //控制用户权限的层级

    role : {
        type : Number,
        default : 0
    },
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

// UserSchema.pre 表示每次存储数据之前都先调用这个方法,这里的this.isNew暂时没有搞清楚，先记住，这里存数据经常这样处理
UserSchema.pre('save', function (next) {
    const user = this
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //给密码加盐，让密码安全性更高
    var SALT_FACTOR = 10//加密强度
    bcrypt.genSalt(SALT_FACTOR, function(err,salt){
        if(err) {
            return next(err)
        }else{
             bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)
                user.password = hash
                next()
            }) 
        }
 //这里犯了一个极大的错误，加盐是需要一定的执行时间的，而我却在这里加了个next（）,导致直接跳过了加盐处理，千万不要再犯这种小错误      
    })
});
//实例方法
UserSchema.methods = {
    comparePassword: function(_password, cb){
        console.log('密码 ' + this.password + '\n这个密码 ' + _password);
        //注意这里的password指的是点前对象，也就是user.password
        bcrypt.compare(_password,this.password,function(err,isMatch) {
            if(err) return cb(err)
            cb(null,isMatch)
        })
    }
}
// movieSchema 模式的静态方法
UserSchema.statics = {
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
module.exports = UserSchema;

