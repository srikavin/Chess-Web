import Component from '@ember/component';
import {inject as service} from '@ember/service';
import ENV from '../config/environment';

let Chess = window.ChessJS;
let ChessBoard = window.ChessBoard;
export default Component.extend({
  auth: service('auth'),
  store: service('store'),
  board: null,
  socket: null,
  didInsertElement() {
    this._super(...arguments);
    const socket = new WebSocket("ws://" + ENV.APP.HOSTNAME + "/game/" + this.get('game_id'));

    socket.onmessage = onUpdate;
    socket.onopen = function () {
      socket.send(JSON.stringify({request: 'update'}));
    };
    const context = this;
    const chess = Chess();

    const board = new ChessBoard('board', {
      draggable: true,
      pieceTheme: '/assets/img/chesspieces/wikipedia/{piece}.png',
      onDrop: onDrop
    });

    this.set('board', board);

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

    let joined = false;

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
        if (!context.get('white')) {
          const id = response.players.white.id;
          const user = context.get('store').find('user', id);
          context.set('white', user);
        }
        if (!context.get('black')) {
          const id = response.players.black.id;
          const user = context.get('store').find('user', id);
          context.set('black', user);
        }
      }
      if (!joined) {
        joined = true;
        socket.send(JSON.stringify({request: 'join', token: auth.get('token')}));
      }
    }
  },
  destroy() {
    if (this.get('board')) {
      this.get('board').destroy();
    }
    if (this.get('socket')) {
      this.get('socket').close();
    }
  }

}).reopenClass({
  positionalParams: ['game_id']
});
