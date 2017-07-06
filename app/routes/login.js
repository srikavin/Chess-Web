import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  beforeModel() {
    console.log(this.get('auth').get('loggedIn'));
    this.set("user", '');
    this.set("pass", '');
  },

  serialize(model) {
    return {after: model.after};
  },

  model() {
    return {login_failed: false, register_failed: false};
  }
});
