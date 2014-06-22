/* jslint node: true */

var express = require('express');
var cookieParser = require('cookie-parser');
var MobileDetect = require('mobile-detect');
var words = require('./words');

var port = 4040;

express()
  .set('view engine', 'jade')
  .set('views', __dirname + '/../client/views')
  .use(express.static(__dirname + '/../dist'))
  .use(cookieParser())
  .get('/', function(req, res) {
    var mobile = new MobileDetect(req.headers['user-agent']).mobile();
    var info = {
      minLength: req.cookies.minLength || 4,
      maxLength: req.cookies.maxLength || 8,
      mobile: mobile,
    };
    res.render('main.jade', info);
  })
  .get('/word', function(req, res) {
    var expiration = { expires: new Date(Date.now() + 900000) };
    res
      .cookie('minLength', req.query.minLength, expiration)
      .cookie('maxLength', req.query.maxLength, expiration)
      .json(words(req.query));
  })
  .listen(port)
;

console.log('listening');
