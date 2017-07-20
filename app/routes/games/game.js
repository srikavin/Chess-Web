import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  model(params) {
    if (!this.get('auth').get('loggedIn')) {
      this.transitionTo('login', {queryParams: {after: 'games.game', params: JSON.stringify(params)}});
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('game_id', this.get('game_id'))
  }
});
