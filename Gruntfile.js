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
        dest: 'dist/main.js',
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
        files: ['client/style/*.styl'],
        tasks: ['stylus'],
      },
      scripts: {
        files: ['client/**/*.js'],
        tasks: ['concat'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['stylus', 'concat', 'concurrent']);
};