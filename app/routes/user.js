import Ember from 'ember';
import {task} from 'ember-concurrency';

const {get, set} = Ember;

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  model: function (params) {
    return this.get('store').findRecord('user', params.user_id);
  },
  uploadPhoto: task(function* (file) {
    console.log(this.get('auth'));
    let response = yield file.upload("http://" + window.location.hostname + '/api/v1/me/image?token=' + this.get('auth').getToken());
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadImage(file) {
      get(this, 'uploadPhoto').perform(file);
    }
  },
  serialize: function (model) {
    alert(1);
    return {
      // user_id: params.user_id,
      username: model.get('username')
    }
  }
});
