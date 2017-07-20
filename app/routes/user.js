import Ember from 'ember';
import {task} from 'ember-concurrency';
import ENV from '../config/environment'

const {get} = Ember;

export default Ember.Route.extend({
  auth: Ember.inject.service('auth'),
  model(params) {
    return this.get('store').findRecord('user', params.user_id);
  },
  uploadPhoto: task(function* (file) {
    yield file.upload(ENV.APP.HOST + '/api/v1/me/image?token=' + this.get('auth').getToken());
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadImage(file) {
      get(this, 'uploadPhoto').perform(file);
    }
  },
});
