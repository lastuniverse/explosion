var server = require( 'http' ).createServer();

/*
 * express section
 */
var express = require( 'express' );
var app = express();

app.use( '/', express.static( 'public' ) );

app.get( '/hello', function( req, res ) {
  res.send( 'Hello World!' );
} );


/*
 * explosion section
 */

var explosion = require( '../../../explosion' );
var wsapp = explosion( server );

wsapp.use( "/system", function( req, res, next ) {
  res.broadcast();
  console.log( "сработал middleware 2 для рассылки /system:", res.message );
  next();
} );

/*
 * ws client imitation
 */

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

/*
 * start server
 */

var port = 3000;
server.on( 'request', app );
server.listen( port, function() {
  console.log( 'Listening on ' + server.address().port )
} );
