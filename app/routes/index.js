import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.set('games', this.get('store').findAll('game'));
  }

});
