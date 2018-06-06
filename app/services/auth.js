import Service from '@ember/service';
import $ from 'jquery';
import ENV from '../config/environment'

export default Service.extend({
  token: null,
  loggedIn: false,
  username: null,
  userid: null,

  init() {
    this._super(...arguments);

    const stored = localStorage.getItem('token');
    const cont = this;

    if (!stored || stored === null) {
      this.logout();
      return;
    }

    function checkLogin(context, tokenVal) {
      sendRequest(tokenVal, 'token').done(data => {
        if (data.success === true) {
          context.login(data, false);
        } else {
          context.logout(false);
        }
      });
    }

    window.addEventListener('storage', function (e) {
      if (e.key === 'token') {
        checkLogin(cont, e.newValue);
      }
    }, false);

    return checkLogin(cont, stored);
  },

  login(data, notUpdate) {
    if (data.success) {
      if (notUpdate === undefined && notUpdate !== false) {
        localStorage.setItem('token', data.token);
      }
      this.set('loggedIn', true);
      this.set('token', data.token);
      this.set('username', data.username);
      this.set('userid', data.userid)
    }
  },
  logout(notUpdate) {
    if (notUpdate === undefined && notUpdate !== false) {
      localStorage.setItem('token', null);
    }
    this.set('loggedIn', false);
    this.set('token', null);
    this.set('username', null);
    this.set('userid', null);
  },
});

function sendRequest(token, action) {
  let host = ENV.APP.HOST,
    namespace = 'api/v1',
    URL = [host, namespace, action].join('/');
  return $.ajax({
    method: "POST",
    url: URL,
    data: {token: token},
  });
}
