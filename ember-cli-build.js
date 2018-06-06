const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const pickFiles = require('broccoli-static-compiler');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-bootstrap': {
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      'importBootstrapCSS': false,
    }
  });

  app.import('vendor/chessboardjs/js/chessboard-0.3.0.min.js');
  app.import('vendor/chessboardjs/css/chessboard-0.3.0.min.css');
  // app.import('bower_components/particles.js/particles.min.js');
  app.import('vendor/chess.js');
  const chessboardjsimg = pickFiles('vendor/chessboardjs/img', {
    srcDir: '/',
    destDir: 'assets/img'
  });
  return app.toTree([chessboardjsimg]);
};
