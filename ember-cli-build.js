/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const pickFiles = require('broccoli-static-compiler');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    'ember-bootstrap': {
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      'importBootstrapCSS': false,
      // 'importBootstrapTheme': true
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/chessboardjs/js/chessboard.min.js');
  app.import('bower_components/chessboardjs/css/chessboard.min.css');
  app.import('bower_components/particles.js/particles.min.js');
  app.import('vendor/chess.js');
  const chessboardjsimg = pickFiles('bower_components/chessboardjs/img', {
    srcDir: '/',
    destDir: 'assets/img'
  });
  return app.toTree([chessboardjsimg]);
};
