import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  auth: service('auth'),
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
