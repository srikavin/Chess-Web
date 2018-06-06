import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('games', function () {
    this.route('game', {path: '/:game_id'});
  });
  this.route('user', {path: '/user/:user_id/'});

  this.route('login', function () {
    this.route('login', {path: '/login/:after'});
  });

  this.route('logout', {path: '/logout'});
  this.route('register');

  this.route('application-error', {path: "*path"});
  this.route('logout');
});

export default Router;
