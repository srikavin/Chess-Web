import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  auth: service('auth'),
  model() {
    this.get('auth').logout();
    this.replaceWith('index');
  }
});
