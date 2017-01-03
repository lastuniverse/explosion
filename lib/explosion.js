'use strict';

var Theserve = require( './messanger' );
var Router = require('./router.js');


exports = module.exports = createApplication;

function createApplication(options) {
  var server = new Theserve(options);
  console.log("TEST");
  return server;
};



//exports.Route = Route;
exports.Router = Router;
