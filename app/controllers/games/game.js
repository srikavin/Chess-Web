import Ember from 'ember';
import ENV from '../../config/environment';

let board;
let Chess = window.ChessJS;
let ChessBoard = window.ChessBoard;
export default Ember.Controller.extend({
  auth: Ember.inject.service('auth'),
  init() {
    this._super(...params);
    const context = this;
    const chess = Chess();

    Ember.run.schedule('afterRender', this, function () {
      const socket = new WebSocket("ws://" + ENV.APP.HOSTNAME + "/game/" + this.get('game_id'));
      socket.onmessage = onUpdate;
      socket.onopen = function () {
        socket.send(JSON.stringify({request: 'update'}));
      };

      board = new ChessBoard('board', {
        draggable: true,
        pieceTheme: '/assets/img/chesspieces/wikipedia/{piece}.png',
        onDrop: onDrop
      });

      window.addEventListener('resize', () => board.resize());

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
