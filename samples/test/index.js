'use strict';

// Подключаем модуль рассылки сообщений
var explosion = require( '../../../explosion' );

// Создаем сервер рассылки сообщений. Действует по принципу express (в перспективе :)
// с той лиш разницей что в качестве пути указывается имя рассылки
// в объекте для тестирования все входящие подключения автоматически подписываются на рассылку /system
var app = explosion( {port: 3000} );
// // создаем миделваре обработчик для любой рассылки
// app.use( /.*/, function( req, res, next ) {
//   console.log( "сработал middleware 1 для всех рассылок: ", res.message );
//   res.send( "/test", "0000000000" ); // дойдет, так как отправитель известен, хоть рассылки и не существует
//   res.broadcast( "/test", "1111111111" ); // не дойдет, рассылки /test не существует
//   next();
//   // res содердит методы:
//   //  res.send - позволяет отправить сообщение обратно отправителю любое количество раз:
//   //    res.send(); // эхо полученного сообщения
//   //    res.send(data); // произвольное сообщение от имени рассылки req.message.name
//   //    res.send(name, data); // произвольное сообщение от имени произвольной рассылки
//   //  res.broadcast - позволяет отправить сообщение всем подписанным на рассылку name:
//   //    res.broadcast(); // эхо полученного сообщения всем подписанным на рассылку req.message.name (прекращает дальнейшую обработку последующих миделваре обработчиков)
//   //    res.broadcast(data); // произвольное сообщение всем подписанным на рассылку req.message.name (прекращает дальнейшую обработку последующих миделваре обработчиков)
//   //    res.broadcast(name, data); // произвольное сообщение от имени произвольной рассылки
//   //  res.end - прекращает дальнейшую обработку последующих миделваре обработчиков
//   //  return res.next - перейти к следующему подходящему миделваре обработчику (если такой есть)
//   //  в случае если в процессе выполнения цепочки миделваре обработчиков не было выполнено ни одного из методов ошибки не возникнет,
//   // это будет просто аналогично игнорированнию данного сообщения
// } );


// создаем второй миделваре обработчик для рассылки /system
app.use( "/system/test", function( req, res, next ) {
  //res.broadcast();
  console.log( "сработал middleware 2 для рассылки /system:", res.message );
  next();
} );

// app.use( /\/system/, function( req, res, next ) {
//   //res.broadcast();
//   console.log( "сработал middleware 3 для рассылки /system:", res.message );
//   //res.end();
//   next();
// } );


// создаем роутер с обработчиками для рассылки /system
var test_router = require('./test_router.js');
app.use('/system', test_router);




// далее имитируем браузерных клиентов

// первый клиент подключается к серверу
var WebSocket = require( 'ws' );
var ws1 = new WebSocket( 'ws://localhost:3000/', {
  protocolVersion: 8,
  origin: 'http://localhost:3000/'
} );

ws1.on( 'open', function open() {
  //console.log('connected');

  // и отправляет сообщение в рассылку /system
  ws1.send(
    JSON.stringify( {
      name: "/system",
      data: {
        test: "22222222222222"
      }
    } )
  );
  ws1.send(
    JSON.stringify( {
      name: "/all/all",
      data: {
        test: "3333333333333"
      }
    } )
  );
  ws1.send(
    JSON.stringify( {
      name: "/system/chat",
      data: {
        test: "4444444444444"
      }
    } )
  );
  ws1.send(
    JSON.stringify( {
      name: "/system/test",
      data: {
        test: "555555555555"
      }
    } )
  );
} );

ws1.on( 'close', function close() {
  //console.log('disconnected');
} );

ws1.on( 'message', function( data, flags ) {
  // выводим все полученные сообщения первым клиентом
  console.log( 'ws1 get message: ', data );
} );

// второй клиент подключается к серверу
var ws2 = new WebSocket( 'ws://localhost:3000/', {
  protocolVersion: 8,
  origin: 'http://localhost:3000/'
} );

ws2.on( 'open', function open() {
  // console.log('connected');
} );

ws2.on( 'close', function close() {
  // console.log('disconnected');
} );

ws2.on( 'message', function( data, flags ) {
  // выводим все полученные сообщения вторым клиентом
  console.log( 'ws2 get message: ', data );
} );
