/* jslint node: true */

var _ = require('underscore');
var fs = require('fs');

function choose(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function validate(options) {
  return {
    minLength: options.minLength,
    maxLength: options.maxLength,
  };
}

function sortLetters(word) {
  return word.split('').sort().join('');
}

function removeAnagrams(words) {
  var filtered = [];

  // list of unique pairs of ['foobar', 'abfoor']
  var pairs = words
    .reduce(function(present, word) {
      if (present.indexOf(word) == -1) {
        present.push(word);
      }
      return present;
    }, [])
    .map(function(word) {
      return [word, sortLetters(word)];
    })
    .sort(function(left, right) {
      if (left[1] == right[1]) {
        return 0;
      } else if (left[1] < right[1]) {
        return -1;
      } else {
        return 1;
      }
    });

  for (var i = 0; i < pairs.length; i++) {
    var j = i + 1;
    while (j < pairs.length && pairs[j][1] == pairs[i][1]) {
      // pairs[i][0] is an anagram of pairs[j][0]
      j++;
    }
    if (j == i + 1) {
      // j wasn't changed, so no anagrams were found
      filtered.push(pairs[i][0]);
    } else {
      // skip all anagrams (-1 to compensate for ++)
      i = j - 1;
    }
  }

  return filtered;
}

function dictionaryFilter(words) {
  var profanity = ['shit', 'fucking'];
  return removeAnagrams(words)

    // remove profanity
    .filter(function(word) {
      return profanity.indexOf(word) == -1;
    })

    // remove proper nouns
    .filter(function(word) {
      return word.charAt(0) != word.charAt(0).toUpperCase();
    });
}

// http://www.englishclub.com/vocabulary/common-words-5000.htm
var allWords = dictionaryFilter(fs
  .readFileSync(__dirname + '/dictionaries/common_words.txt', {
    encoding: 'utf8'
  })
  .split('\n'));

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