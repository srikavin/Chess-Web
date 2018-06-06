import DS from 'ember-data';
import ENV from '../config/environment'
import {computed} from '@ember/object';

export default DS.Model.extend({
  username: DS.attr('string'),
  lastSeen: DS.attr('date'),
  bio: DS.attr('string'),
  imageUrl: computed('id', function () {
    return `${ENV.APP.HOST}/api/v1/users/${this.get('id')}/preview`;
  })
});
