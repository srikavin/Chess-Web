import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
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
  this.route('register');

  this.route('application-error', {path: "*path"});
});

export default Router;
