var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category.js')
module.exports = function(app){
	//pre handle user ,不加路由代表必须经过这个中间件的处理
	app.use(function(req,res,next) {
		var _user = req.session.user//这里是无论req.session.user是否存在，都是将req.sesson.user赋值给app.locals.user，所以在logout的时候不需要再delete app.locals.user
			app.locals.user = _user//这里的app.locals表示的是存到全局里面
			next()
	})
	//index
	app.get('/', Index.index)
	//user
	app.post('/user/signup', User.signup)
	app.post('/user/signin',User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	app.get('/logout', User.logout)
	//天假权限控制
	app.get('/admin/userlist' ,User.signinRequired,User.adminRequired,User.userlist)
	app.get('/test',User.test)
	//movie
	app.get('/movie/:id', Movie.detail)
	app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new)
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired, Movie.update)
	app.post('/admin/movie/save', User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list)
	app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del)
	//comment
	app.post('/user/comment', User.signinRequired,Comment.save)
	//category
	app.get('/admin/category/new',User.signinRequired,User.adminRequired, Category.new)
	app.post('/admin/category', User.signinRequired,Category.save)
	app.get('/admin/category/list',User.signinRequired,User.adminRequired, Category.list)
	//retults
	app.get('/results',Index.search)

}
