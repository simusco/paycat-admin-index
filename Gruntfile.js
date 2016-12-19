module.exports = function (grunt) {

    grunt.initConfig({
        copy: {
            css:{
                files:[{expand:true,cwd: 'css',src:['*.css'],dest:'dist/css/'}]
            },
            js:{
                files:[{expand:true,cwd: 'js', src:['*.js','lib/**/*.js'],dest:'dist/js/'}]
            },
            html:{
                files:[
                    {expand: true,src: ['index.html','admin.html'],dest: 'dist/'},
                    {expand:true,cwd: 'views',src:['**/*.html'],dest:'dist/views/',flatten: false}
                ]
            },
            images:{
                files:[{expand:true,cwd: 'images',src:['**/*'],dest:'dist/images/',flatten: false}]
            }
        },
        compass:{
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css'
                }
            }
        },
        webpack:{
            admin:{
                entry: './js/admin/admin.js',
                output: {
                    path: './js',
                    filename: 'admin.js'
                },
                module: {
                    loaders:[
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            exclude: /(node_modules|bower_components)/,
                            query:{presets: ['es2015'],plugins: ['transform-runtime']}
                        }
                    ]
                }
            }
        },
        usemin:{html:['./dist/index.html','./dist/admin.html']},
        clean: {
            dest: {
                src: ['dist/**/*']
            },
            js:{
                src: ['./js/*.js']
            }
        },
        connect: {
            options: {
                protocol: 'http',
                port: 9090,
                hostname: '*',
                livereload: 35729
            },
            server: {
                options:{
                    open: true,
                    base: ['./']
                }
            }
        },
        uglify:{
            options: {
                mangle: false
            },
            main:{
                files:{
                    './js/admin.min.js':['./js/admin.js']
                }
            }
        },
        watch: {
            html:{
                files: ['./views/**/*.html','index.html','admin.html'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['./js/**/*.js'],
                tasks: ['webpack:admin'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['./sass/**/*.scss'],
                tasks: ['compass:dev'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: { livereload: 35729 },
                files: ['./']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['clean','webpack:admin','uglify:main','compass:dev','copy','usemin','clean:js']);
    grunt.registerTask('serve', ['connect:server','watch']);
    grunt.registerTask('default', ['clean','webpack:admin','compass:dev','copy','usemin','connect:server','watch']);

}