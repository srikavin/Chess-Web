import Ember from 'ember';

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
    // Call _super for default behavior
    this._super(controller, model);
    // Implement your custom setup after
    // console.log(this.controllerFor('games.game'));
    controller.set('game_id', this.get('game_id'))
    // this.controllerFor('games.game').set('game_id', this.get('game_id'));
  }
});
