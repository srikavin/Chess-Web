import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  beforeModel() {

  },
  model(params) {
    // console.log(params);
    console.log(this.get('auth').get('loggedIn'));
    this.set('game_id', params.game_id);
    if (!this.get('auth').get('loggedIn')) {
      this.transitionTo('login', {queryParams: {after: 'games.game', params: JSON.stringify(params)}});
    }
    return params;
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('game_id', this.get('game_id'))
  }
});
