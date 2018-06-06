import $ from 'jquery';
import {inject as service} from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['after', 'params'],
  auth: service('auth'),
  after: undefined,
  params: undefined,

  actions: {
    login() {
      const {user, pass} = this.getProperties('user', 'pass');
      sendRequest(this, user, pass, 'login').then((request) => {
        let after = this.get('after');
        let params = this.get('params');
        if (request.success) {
          this.setProperties({user: '', pass: '', login_failed: false, register_failed: false});
          this.get('auth').set('token', request.token);
          this.get('auth').login(request);
          if (after) {
            this.transitionToRoute(after, JSON.parse(params));
          } else {
            this.transitionToRoute('user', request.userid);
          }
        } else {
          this.set('login_failed', true);
          this.set('register_failed', false);
        }
      });
    },
    register() {
      const {user, pass} = this.getProperties('user', 'pass');
      sendRequest(this, user, pass, 'register').then((request) => {
        this.setProperties({user: '', pass: ''});
        this.set('login_failed', false);
        this.set('register_failed', false);
        this.transitionToRoute('user', request.id);
      });
      this.set('login_failed', false);
      this.set('register_failed', true);
    }
  }
});

function sendRequest(self, user, pass, action) {
  let host = self.store.adapterFor('application').get('host'),
    namespace = self.store.adapterFor('application').namespace,
    URL = [host, namespace, 'auth'].join('/');
  return $.ajax({
    method: 'POST',
    url: URL,
    data: {request: action, username: user, password: pass}
  });
}
