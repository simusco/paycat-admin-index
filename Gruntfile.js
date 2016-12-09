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
                    {expand: true,src: ['website.html','index.html','admin.html'],dest: 'dist/'},
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
                }
            }
        },
        usemin:{html:['./dist/index.html']},
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
                    base: ['dist']
                }
            }
        },
        watch: {
            html:{
                files: ['./views/**/*.html','website.html','index.html','admin.html'],
                tasks: ['copy:html'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['./js/**/*.js'],
                tasks: ['webpack:admin','copy:js'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['./sass/**/*.scss'],
                tasks: ['compass:dev','copy:css'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: { livereload: 35729 },
                files: ['dist']
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

    grunt.registerTask('build', ['clean','webpack:admin','compass:dev','copy','usemin','clean:js']);
    grunt.registerTask('default', ['clean','webpack:admin','compass:dev','copy','usemin','connect:server','watch']);

}