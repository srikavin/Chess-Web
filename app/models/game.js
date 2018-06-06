import {computed} from '@ember/object';
import DS from 'ember-data';
import ENV from '../config/environment'

export default DS.Model.extend({
  playerBlack: DS.belongsTo('user'),
  playerWhite: DS.belongsTo('user'),
  preview: computed('id', function () {
    return `${ENV.APP.HOST}/${ENV.APP.NAMESPACE}/games/${this.get('id')}/preview`;
  })
});
