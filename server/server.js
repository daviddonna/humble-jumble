/* jslint node: true */

var express = require('express');
var cookieParser = require('cookie-parser');
var words = require('./words');

var port = 4040;

express()
  .set('view engine', 'jade')
  .set('views', __dirname + '/../client/views')
  .use(express.static(__dirname + '/../dist'))
  .use(cookieParser())
  .get('/', function(req, res) {
    var playerInfo = {
      minLength: req.cookies.minLength || 4,
      maxLength: req.cookies.maxLength || 8,
    };
    res.render('main.jade', playerInfo);
  })
  .get('/word', function(req, res) {
    res
      .cookie('minLength', req.query.minLength, { expires: new Date(Date.now() + 900000) })
      .cookie('maxLength', req.query.maxLength, { expires: new Date(Date.now() + 900000) })
      .json(words(req.query));
  })
  .listen(port)
;

console.log('listening');