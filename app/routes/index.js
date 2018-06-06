import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.set('games', this.get('store').findAll('game'));
  }
});
