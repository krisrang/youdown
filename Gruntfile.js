var parseBuildPlatforms = function(argumentPlatform) {
  // this will make it build no platform when the platform option is specified
  // without a value which makes argumentPlatform into a boolean
  var inputPlatforms = argumentPlatform || process.platform + ";" + process.arch;

  // Do some scrubbing to make it easier to match in the regexes bellow
  inputPlatforms = inputPlatforms.replace("darwin", "mac");
  inputPlatforms = inputPlatforms.replace(/;ia|;x|;arm/, "");

  var buildAll = /^all$/.test(inputPlatforms);

  var buildPlatforms = {
    mac: /mac/.test(inputPlatforms) || buildAll,
    win: /win/.test(inputPlatforms) || buildAll,
    linux32: /linux32/.test(inputPlatforms) || buildAll,
    linux64: /linux64/.test(inputPlatforms) || buildAll
  };

  return buildPlatforms;
};

module.exports = function(grunt) {
  var buildPlatforms = parseBuildPlatforms(grunt.option('platforms'));

  grunt.initConfig({
    compass: {
      dist: {
        options: {
          cssDir: 'css'
        },
        files: {
          'css/app.css': 'sass/app.scss'
        }
      }
    },
    watch: {
      files: ['sass/**/*.scss'],
      tasks: ['sass'],
      options: {
        livereload: true
      }
    },
    nodewebkit: {
      options: {
        version: '0.9.2',
        build_dir: './build',
        mac_icns: './images/youdown.icns',
        mac: buildPlatforms.mac,
        win: buildPlatforms.win,
        linux32: buildPlatforms.linux32,
        linux64: buildPlatforms.linux64
      },
      src: ['./css/**', './fonts/**', './images/**', './js/**', './language/**', './node_modules/**', '!./node_modules/bower/**', '!./node_modules/grunt*/**', './Config.rb', './index.html', './package.json', './README.md' ]
    },
    copy: {
      vendor: {
        files: [
          { src: 'vendor/fontawesome/css/font-awesome.css', dest: 'css/', expand: true, flatten: true },
          { src: 'vendor/fontawesome/fonts/*', dest: 'fonts/', expand: true, flatten: true }
        ]
      },
      libs: {
        files: [
          {
            src: 'lib/win/ffmpegsumo.dll',
            dest: 'build/releases/YouDown/win/YouDown/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'lib/win/ffmpegsumo.dll',
            dest: 'build/cache/win/<%= nodewebkit.options.version %>/ffmpegsumo.dll',
            flatten: true
          },
          {
            src: 'lib/mac/ffmpegsumo.so',
            dest: 'build/releases/YouDown/mac/YouDown.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
            flatten: true
          },
          {
            src: 'lib/mac/ffmpegsumo.so',
            dest: 'build/cache/mac/<%= nodewebkit.options.version %>/node-webkit.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so',
            flatten: true
          },
          {
            src: 'lib/linux64/libffmpegsumo.so',
            dest: 'build/releases/YouDown/linux64/YouDown/libffmpegsumo.so',
            flatten: true
          },
          {
            src: 'lib/linux64/libffmpegsumo.so',
            dest: 'build/cache/linux64/<%= nodewebkit.options.version %>/libffmpegsumo.so',
            flatten: true
          }
        ]
      }
    },
    shell: {
      start: {
        options: {
          stdout: true
        },
        command: '/Applications/node-webkit.app/Contents/MacOS/node-webkit .'
      },
      debug: {
        options: {
          stdout: true
        },
        command: '/Applications/node-webkit.app/Contents/MacOS/node-webkit . --debug'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('assets', ['copy:vendor', 'compass']);
  grunt.registerTask('default', ['assets', 'shell:debug']);
  grunt.registerTask('nodewkbuild', ['nodewebkit', 'copy:libs']);
  grunt.registerTask('build', ['assets', 'nodewkbuild']);
};