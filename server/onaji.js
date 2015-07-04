import dbg from 'debug';
import Rx from 'rx';
import _ from 'lodash';

var debug = dbg('app:onaji');

export class Peer {
  constructor(id, stream) {
    this.id = id;
    this._moves = new Rx.ReplaySubject();
    this.stream = stream;
  }

  move(pos, offset) {
    this._moves.onNext({ id: this.id, pos: pos, offset: offset });
  }

  getMovesStream() {
    return this._moves.delayWithSelector(x => Rx.Observable.timer(x.offset));
  }
}

export default class Onaji {
  constructor() {
    this._peers = {};
  }

  peerEnter(id) {
    debug(`peer enter: ${id}`);
    var stream = this.getMovesStream();
    var peer = this._peers[id] = new Peer(id, stream);
    return peer;
  }

  peerMove(id, pos, offset) {
    debug('moved', id, pos, offset);
    this._peers[id].move(pos, offset);
  }

  getMovesStream() {
    var peers = this._peers;
    var streams = Object.keys(peers).map(id => peers[id].getMovesStream());

    return Rx.Observable.merge(streams);
  }
}
