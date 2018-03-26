module.exports = function(grunt) {
	//使用grunt的目的是方便开发，免得每次改动文件都需要刷新页面，通过nodemon监听可以当文件改变时重启项目
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true//文件改动时，重新启动服务
				}
			},
			js:	{
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		/*	styles: {
				files: ['resources/css/*.css'],
				tasks: ['css'],
				options: {
					nospawn: true
				}
			}*/

		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					/*watchedFolders: ['app', 'config'],//因为暂时还不存在app和config这两个文件夹，所以先直接监听根目录*/
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
					PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}

	});

	grunt.option('force', true);

	grunt.loadNpmTasks('grunt-contrib-watch'); // 监听文件变动
	grunt.loadNpmTasks('grunt-nodemon'); // 监听入口文件
	grunt.loadNpmTasks('grunt-concurrent'); 

	grunt.registerTask('default', ['concurrent']);
};