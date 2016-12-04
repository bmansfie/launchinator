'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = require('express')();
var userAuth = require('./auth/userAuth.js');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use('/swagger-ui', express.static('dist'));
app.use(function(req, res, next) {
  if (req.query.id) {
    try {
      req.query.id = parseFloat(req.query.id);
    } catch (err) { }
  }
  if (req.query.time) {
    try {
      req.query.time = parseFloat(req.query.time);
    } catch (err) { }
  }
  next();
});
app.use(userAuth.expressMiddleware);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
