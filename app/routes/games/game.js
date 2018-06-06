import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  auth: service('auth'),
  model(params) {
    if (!this.get('auth').get('loggedIn')) {
      this.transitionTo('login', {queryParams: {after: 'games.game', params: JSON.stringify(params)}});
    }
    console.log(typeof params);
    console.log(params);
    return {
      'game_id': params.game_id
    }
  },
});
