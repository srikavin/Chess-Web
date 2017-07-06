import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  lastSeen: DS.attr('date'),
  bio: DS.attr('string'),
  imageUrl: Ember.computed('id', function () {
    return `http://${location.hostname}/api/v1/user/image/?id=${this.get('id')}`;
  })
});
