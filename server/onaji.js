import dbg from 'debug';
import Rx from 'rx';

var debug = dbg('app:onaji');

class Peer {
  constructor(id) {
    this._id = id;
    this._moves = [];
  }

  move(pos, delta) {
    this._moves.push({ pos: pos, delta: delta });
  }
}

export default class Onaji {
  constructor() {
    this._peers = {};
  }

  peerEnter(id) {
    debug(`peer enter: ${id}`);
    this._peers[id] = new Peer(id);
  }

  peerMove(id, pos, delta) {
    debug('moved', id, pos, delta);
    this._peers[id].move(pos, delta);
  }
}

export {
  Peer
};
