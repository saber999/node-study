var User = require('../models/user.js')

//signup
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'登录页面'
	})
}
//signup
exports.showSignup = function(req,res){
	res.render('signup',{
		title:'注册页面'
	})
}
exports.signup = function(req,res){
	var _user = req.body.user//提交的数据经过了bodyParser的处理
	//req.param('user')也可取得user的值
	// /user/signup/:userid  var userid=req.params.userid
	// /user/signup/1111?userid=1112  var userid=req.query.userid  var userid=req.body.userid
	User.find({name:_user.name}, function(err,user){
		//find查找出的是一个数组，findOne查找出的是一条数据
		if(err){
			console.log(err)
		}
		console.log(user)
		if(user.length>0){
			console.log(user)
			return res.redirect('/signin')
		}else{
			var user = new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})	
}
//userlist page
exports.userlist = function(req,res) {
	User.fetch(function (err, users) {
	        if (err) {
	            console.log(err);
	        }
	        res.render('userlist', {
	            title: '用户 列表页',
	            users: users
	        });
	    });
}
//signin
exports.signin = function(req,res){
	var _user=req.body.user
	var name=req.body.user.name
	var password=req.body.user.password
		User.findOne({name:name}, function(err,user){
			if(err){
				console.log(err)
			}
			if(!user){
				return res.redirect('/signup')
			}
			console.log(user)
			user.comparePassword(password,function(err,isMatch){
				if(err){
					console.log(err)
				}
				if(isMatch) {
					req.session.user=user
					return res.redirect('/')
				}else{
					console.log('密码错误')
					return res.redirect('/signin')
				}
			})
		})
}
//logout
exports.logout = function(req,res) {
	delete req.session.user
	/*delete app.locals.user*/
	res.redirect('/')
}
//midware for user  用户权限控制
exports.signinRequired = function(req,res,next) {
	var user = req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
exports.adminRequired = function(req,res,next) {
	var user = req.session.user
	console.log(user)
	if(user.role <=10 || !user.role){
		return res.redirect('/signin')//express的if是如果满足if就不继续往下走了，直接执行if里面的代码
	}else{
			next()

	}
}
//test 测试ajax访问接口
var questions=[{data:213,num:444,age:12},{data:456,num:678,age:13}];
exports.test = function(req,res){
	res.status(200)
	res.send(questions)//res.json和res.send两者有时可以共用，底层代码中，res.json也是通过send方法来发送的
}