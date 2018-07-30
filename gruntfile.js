/*
  Responsive images at https://www.npmjs.com/package/grunt-responsive-images
  Run "grunt responsive_images" to re-process the images
*/
module.exports = function (grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            /* Change these */
            width: 1600,
            suffix: '_xlg',
            quality: 100
          },{
          	width: 800,
            suffix: '_lg',
            quality: 100
          },{
          	width: 400,
            suffix: '_md',
            quality: 85
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');

};