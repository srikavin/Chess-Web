import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  beforeModel() {
    this.set('user', '');
    this.set('pass', '');
  },

  serialize(model) {
    return {after: model.after};
  },

  model() {
    return {login_failed: false, register_failed: false};
  }
});
