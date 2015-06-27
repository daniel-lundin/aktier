module.exports = function(grunt) {

  var config = {
    connectOptions: {
      base: 'www-root',
      hostname: '*',
      port: 9000
    },
    buildFolder: 'dist',
    livereload: 35729,
    jsLibFiles: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/fastclick/lib/fastclick.js'
    ],
    jsFiles: [
      'app.js'
    ]
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connectOptions: config.connectOptions,
    buildFolder: config.buildFolder,

    connect: {
      server: {
        options: config.connectOptions
      }
    },

    clean: {
      deploy: [config.buildFolder],
      develop: [config.connectOptions.base]
    },

    jade: {
      develop: {
        options: {
          data: {
            jsFiles: config.jsFiles,
            jsLibFiles: config.jsLibFiles,
            develop: true
          }
        },
        files: {
          '<%= connectOptions.base %>/index.html': 'src/jade/index.jade'
        }
      },
      deploy: {
        options: {
          data: {
            jsFiles: ['app-<%= pkg.version %>.min.js' ],
            develop: false,
            version: '<%= pkg.version %>'
          }
        },
        files: {
          '<%= buildFolder %>/index.html': 'src/jade/index.jade'
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
        globals: {
          console: true
        }
      }
    },

    scsslint: {
      allFiles: [
        'src/scss/**/*.scss', '!src/scss/vendor/**/*.scss'
      ],
      options: {
        config: ".scss-lint-config.yml",
        reporterOutput: null
      }
    },

    sass: {
      develop: {
        files: {
          '<%= connectOptions.base %>/css/app.css': 'src/scss/app.scss'
        }
      },
      deploy: {
        options: {
          style: 'compressed'
        },
        files: {
          '<%= buildFolder %>/css/app-<%= pkg.version %>.min.css': 'src/scss/app.scss'
        }
      }
    },

    copy: {
      develop: {
        files: [
          {
            expand: true,
            src: [
              'assets/**/*'
            ],
            dest: '<%= connectOptions.base %>/',
            cwd: 'src/'
          },
          {
            expand: true,
            src: [
              'fonts/*'
            ],
            dest: '<%= connectOptions.base %>/',
            cwd: 'src/'
          },
          {
            expand: true,
            src: config.jsLibFiles,
            dest: '<%= connectOptions.base %>/js'
          },
          {
            expand: true,
            src: config.jsFiles,
            dest: '<%= connectOptions.base %>/js',
            cwd: 'src/js'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            src: [
              'assets/**/*'
            ],
            dest: '<%= buildFolder %>/',
            cwd: 'src/'
          },
          {
            expand: true,
            src: [
              'fonts/*'
            ],
            dest: '<%= buildFolder %>/',
            cwd: 'src/'
          },
        ]
      }
    },

    uglify: {
      deploy: {
        files: {
          '<%= buildFolder %>/js/app-<%= pkg.version %>.min.js': (function() {
            var allFiles = [];

            config.jsFiles.forEach(function(f) {
              allFiles.push('src/js/' + f);
            });

            return config.jsLibFiles.concat(allFiles);
          }())
        }
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: config.livereload
        },
        files: [ '<%= connectOptions.base %>/**/*']
      },
      jade: {
        files: ['src/jade/*.jade'],
        tasks: ['jade']
      },
      js: {
        files: ['Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['jshint', 'copy:develop']
      },
      scss: {
        files: ['src/scss/**/*.scss'],
        tasks: ['scsslint', 'sass:develop']
      },
      assets: {
        files: ['src/assets/**/*'],
        tasks: ['copy:develop']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-scss-lint');

  grunt.registerTask('develop', ['clean:develop', 'jade:develop', 'scsslint', 'sass:develop', 'jshint', 'copy:develop', 'connect', 'watch']);
  grunt.registerTask('build', ['clean:deploy', 'jade:deploy', 'scsslint', 'sass:deploy', 'jshint', 'uglify', 'copy:deploy']);
};
