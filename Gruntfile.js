// jshint node: true

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    stylus: {
      compile: {
        options: {
          paths: ['client/style'],
          import: ['nib'],
          compress: false,
        },
        files: {
          'dist/main.css': 'client/style/main.styl',
        },
      },
    },

    concat: {
      dist: {
        src: ['client/js/modes/*.js',
              'client/js/shuffle.js',
              'client/js/main.js'],
        dest: 'dist/concat.js',
      },
    },

    copy: {
      main: {
        expand: true,
        cwd: 'client/assets/',
        src: '*',
        dest: 'dist/',
      },
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true,
        },
      },
    },

    nodemon: {
      dev: {
        script: 'server/server.js',
        options: {
          cwd: __dirname,
          watch: ['server/.js'],
          ignore: ['server/test/*'],
        },
      },
    },

    watch: {
      options: {
        livereload: true,
      },
      markup: {
        files: ['client/views/*.jade'],
      },
      style: {
        files: ['client/**/*.styl'],
        tasks: ['stylus'],
      },
      scripts: {
        files: ['client/**/*.js'],
        tasks: ['concat'],
      },
      assets: {
        files: ['client/assets/*'],
        tasks: ['copy'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build', ['stylus', 'concat', 'copy']);
  grunt.registerTask('default', ['build', 'concurrent']);
};