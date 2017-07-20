import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  model() {
    this.get('auth').logout();
    this.replaceWith('index');
  }
});
