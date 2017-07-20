import Ember from 'ember';
import ENV from '../../config/environment';
// import Chess from 'npm:chess.js';
let board;
// import Chess from 'chess.js';
let Chess = window.ChessJS;
export default Ember.Controller.extend({
  game_id: null,
  auth: Ember.inject.service('auth'),
  init() {
    this._super();
    const context = this;
    const chess = Chess();
    console.log("model", this.get('model'));
    Ember.run.schedule('afterRender', this, function () {
      const socket = new WebSocket("ws://" + ENV.APP.HOSTNAME + "/game/" + this.get('game_id'));
      window.test = socket;
      socket.onmessage = onUpdate;
      socket.onopen = function () {
        socket.send(JSON.stringify({request: 'update'}));
      };

      board = new ChessBoard('board', {
        draggable: true,
        pieceTheme: '/assets/img/chesspieces/wikipedia/{piece}.png',
        onDrop: onDrop
      });
      $(window).on('resize', () => board.resize());

      const auth = this.get('auth');

      function onDrop(source, target) {
        socket.send(JSON.stringify({request: 'submit', source: source, end: target, token: auth.get('token')}));
        const move = chess.move({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        if (move === null) {
          return 'snapback';
        }
      }

      let a = true;

      function onUpdate(event) {
        const response = JSON.parse(event.data);
        if (response.error) {
          return;
        }
        if (response.game) {
          const fen = response.game;
          board.position(fen);
          chess.load(fen);
          context.set('fen', fen);
          console.log(fen);
        }
        if (a) {
          a = !a;
          socket.send(JSON.stringify({request: 'join', token: auth.get('token')}));
        }
      }
    });
  },
  destroy() {
    if (board) {
      board.destroy();
    }
  }

});
