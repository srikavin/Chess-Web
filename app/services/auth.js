import Ember from 'ember';

export default Ember.Service.extend({
  token: null,
  loggedIn: false,
  username: null,
  userid: null,
  init() {
    this._super(...arguments);
    const stored = localStorage.getItem("token");
    if (stored === null) {
      this.set('loggedIn', false);
      return;
    }
    return sendRequest(stored, 'token').done(data => {
      console.log(data);
      if (data.success) {
        this.set('token', stored);
        this.set('loggedIn', true);
        this.set('username', data.username);
        this.set('userid', data.userid);
      } else {
        this.set('token', null);
        this.set('loggedIn', false);
        this.set('username', null);
        this.set('userid', null);
      }
    });
  },
  login(data) {
    if (data.success) {
      this.set('loggedIn', true);
      this.set("token", data.token);
      this.set("username", data.username);
      this.set("userid", data.userid)
    }
  },
  tokenChanged: Ember.observer('token', function () {
    localStorage.setItem('token', this.get('token'));
  }),
});

function sendRequest(token, action) {
  let namespace = 'api/v1',
    URL = [namespace, action].join('/');
  return Ember.$.ajax({
    method: "POST",
    url: URL,
    async: false,
    data: {token: token},
  });
}
