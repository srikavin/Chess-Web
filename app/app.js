import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  // Basic logging, e.g. "Transitioned into 'post'"
  LOG_TRANSITIONS: true,

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  // LOG_TRANSITIONS_INTERNAL: true,

  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
