/* jslint node: true */

var _ = require('underscore');
var fs = require('fs');

function choose(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function validate(options) {
  return {
    minLength: options.minLength || 4,
    maxLength: options.maxLength || 9,
  };
}

// http://www.englishclub.com/vocabulary/common-words-5000.htm
var allWords = fs
  .readFileSync(__dirname + '/dictionaries/common_words.txt', {
    encoding: 'utf8'
  })
  .split('\n');

module.exports = function(rawOptions) {
  var options = validate(rawOptions);

  var word = choose(_.filter(allWords, function(word) {
    return word.length >= options.minLength &&
           word.length <= options.maxLength;
  }));

  return {
    word: word,
  };
};