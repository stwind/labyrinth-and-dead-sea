// import dbg from 'debug';
// import { Rx } from 'cyclejs';
// import autobahn from 'autobahn';

// var debug = dbg('app:wamp:driver');

// function createWampDriver(url, realm) {

//   var onaji = new autobahn.Connection({ url: url, realm: realm });

//   onaji.onopen = function (session) {
//     debug('hihi', session);
//   };

//   onaji.open();

//   function get(eventName) {
//     return Rx.Observable.create(observer => {
//       const sub = socket.on(eventName, function (message) {
//         observer.onNext(message);
//       });
//       return function dispose() {
//         sub.dispose();
//       };
//     });
//   }

//   function publish(messageType, message) {
//     socket.emit(messageType, message);
//   }

//   return function socketIODriver(events$) {
//     events$.forEach(event => publish(event.messageType, event.message));
//     return {
//       get,
//       dispose: socket.destroy.bind(socket)
//     }
//   };
// }

// export default { createWampDriver };
