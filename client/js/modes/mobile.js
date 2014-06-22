/* jshint browser: true, jquery: true */

var mobileMode = (function() {
  var LEFT = 1;
  var RIGHT = -1;

  function findUnused(letter) {
    var shuffledLetters = $('.shuffled-letter');
    for (var i = 0; i < shuffledLetters.length; i++) {
      var element = $(shuffledLetters.get(i));
      if (!element.hasClass('used')) {
        if (element.text() == letter) {
          return $(element);
        }
      }
    }
    return null;
  }

  function analyzeUsage() {
    var input = $('#mobile-input');

    $('.shuffled-letter').removeClass('used');

    var inputWord = input.val().toLowerCase();
    console.log(inputWord.length, inputWord);

    for (var i = 0; i < inputWord.length; i++) {
      var letter = inputWord.charAt(i);
      var unused = findUnused(letter);
      if (unused) {
        unused.addClass('used');
      }
    }

    if (inputWord.length == currentWord.length) {
      $.event.trigger({
        type: 'submit',
        word: inputWord,
      });
    }
  }

  function displayShuffled(shuffled) {
    console.log(shuffled);
    var jqShuffled = $('#shuffled');
    jqShuffled.empty();
    shuffled.split('').forEach(function(letter) {
      jqShuffled.append('<div class="shuffled-letter">' +
        '<span>'+letter+'</span>' +
        '</div>');
    });
  }

  return {
    newWord: function(word, shuffled) {
      displayShuffled(shuffled);
      $('#mobile-input')
        .on('input', analyzeUsage)
        .val('')
        .focus();
    },

    hint: function() {
      $('#mobile-input')
        .val(currentWord.charAt(0))
        .focus();
      analyzeUsage();
    },

    endRound: function() {
      $('#mobile-input')
        .off('input')
        .blur();
    },

    reshuffle: function(shuffled) {
      displayShuffled(shuffled);
    },
  };
})();