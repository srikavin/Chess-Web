import DS from 'ember-data';

export default DS.Model.extend({
  playerBlack: DS.belongsTo('user'),
  playerWhite: DS.belongsTo('user'),
  preview: Ember.computed('id', function () {
    let adapter = this.store.adapterFor(this.constructor.modelName)
    return `${adapter.get('host')}/${adapter.get('namespace')}/games/${this.get('id')}/preview`;
  })
});
