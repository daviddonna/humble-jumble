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
    res
      .cookie('minLength', req.query.minLength, { expires: new Date(Date.now() + 900000) })
      .cookie('maxLength', req.query.maxLength, { expires: new Date(Date.now() + 900000) })
      .json(words(req.query));
  })
  .listen(port)
;

console.log('listening');