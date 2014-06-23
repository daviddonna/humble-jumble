/* jslint browser: true, jquery: true */

/*
  Simple jumble view. Displays the shuffled letters in a row
 */

var flat = (function() {
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
    var answerLetters = $('.answer-letter');

    $('.shuffled-letter').removeClass('used');
    answerLetters.removeClass('incorrect');

    var inputWord = answerLetters
      .slice(0, currentWord.length)
      .map(function() { return this.innerHTML || '\0'; })
      .get()
      .join('');

    for (var i = 0; i < answerLetters.length; i++) {
      var element = $(answerLetters.get(i));
      var letter = element.html();
      if (letter) {
        var unused = findUnused(letter);
        if (unused) {
          unused.addClass('used');
        } else {
          element.addClass('incorrect');
        }
      }
    }

    if (inputWord.indexOf('\0') == -1) {
      $.event.trigger({
        type: 'submit',
        word: inputWord,
      });
    }
  }

  function move(direction) {
    var current = $('.focus');
    var next;
    if (direction == LEFT) {
      next = current.prev();
    } else {
      next = current.next();
    }
    if (next.length > 0) {
      current.removeClass('focus');
      next.addClass('focus');
    }
  }

  function setCurrent(value) {
    $('.answer-letter-container.focus')
      .children()
      .first()
      .removeClass('incorrect')
      .html(value);
  }

  function addLetter(value) {
    setCurrent(value);
    move(RIGHT);
  }

  function isLetter(which) {
    return (which >= 65 && which <= 90) ||
           (which >= 97 && which <= 122);
  }

  function onKeyPress(e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }

    var current = $('.focus');

    if (isLetter(e.which)) {
      var letter = String.fromCharCode(e.which).toLowerCase();
      if (!current.is(':last-child')) {
        addLetter(letter);
      }
    } else {
      switch (e.keyCode) {
      case 8: // backspace
        if (current.children().html() !== '') {
          setCurrent('');
          move(LEFT);
        } else {
          move(LEFT);
          setCurrent('');
        }
        break;
      case 46: // delete
        // TODO: move all following text back by one
        setCurrent('');
        move(RIGHT);
        break;
      case 9: // tab
        if (e.shiftKey) {
          move(LEFT);
        } else {
          move(RIGHT);
        }
        break;
      case 37: // left arrow
        move(LEFT);
        break;
      case 39: // right arrow
        move(RIGHT);
        break;
      default:
        return true;
      }
    }

    e.preventDefault();
    analyzeUsage();
  }

  function displayShuffled(shuffled) {
    var jqShuffled = $('#shuffled');
    jqShuffled.empty();
    shuffled.split('').forEach(function(letter) {
      jqShuffled.append('<div class="shuffled-letter">' +
        '<span>'+letter+'</span>' +
        '</div>');
    });
  }

  function displayBlanks(length) {
    var jqAnswer = $('#answer');
    jqAnswer.empty();
    for (var i = 0; i <= length; i++) {
      $('<div class="answer-letter-container"></div>')
        .append('<div class="answer-letter"></div>')
        .attr('tabindex', i)
        .appendTo(jqAnswer);
    }
  }

  return {
    newWord: function(word, shuffled) {
      displayShuffled(shuffled);
      displayBlanks(word.length);
      $(document).on('keypress', onKeyPress);
      $('.answer-letter-container').first().addClass('focus');
    },

    hint: function(hintsGiven) {
      $('.answer-letter').html('');
      $('.answer-letter-container')
        .removeClass('focus')
        .first()
        .addClass('focus');
      for (var i = 0; i < hintsGiven; i++) {
        addLetter(currentWord.charAt(i));
      }
      analyzeUsage();
    },

    endRound: function() {
      $(document).off('keypress');
    },

    reshuffle: function(shuffled) {
      displayShuffled(shuffled);
    },

    refocus: function() {
      $('*').blur();
    },
  };
})();
/* jshint browser: true, jquery: true */

var mobileMode = (function() {
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

    hint: function(hintsGiven) {
      $('#mobile-input')
        .val(currentWord.substring(0, hintsGiven))
        .focus();
      analyzeUsage();
    },

    endRound: function() {
      $('#mobile-input')
        .off('input');
    },

    reshuffle: function(shuffled) {
      displayShuffled(shuffled);
      analyzeUsage();
    },

    refocus: function() {
      $('#mobile-input').focus();
    },
  };
})();

var wheel = (function() {
  function position(index, wordLength, radius) {
    var angle = (2 * Math.PI) * (index / wordLength) + Math.PI;
    return {
      top: Math.round(radius * Math.cos(angle) + radius),
      left: Math.round(radius * Math.sin(angle) + radius),
    };
  }

  function displayShuffled(word) {
    var container = $('#wheel');
    container.empty();
    var smallDimension = Math.min(container.height(), container.width());
    var radius = (smallDimension) / 2 - 30;
    console.log(radius);
    for (var i = 0; i < word.length; i++) {
      var letter = word.charAt(i);
      var pos = position(i, word.length, radius);
      var element = $('<div class="shuffled-letter"><span>'+letter+'</span></div>');
      element.css(pos).appendTo(container);
    }
  }

  return {
    display: displayShuffled,
  };
})();
var shuffle = (function() {
  function distant(word, shuffled) {
    var last = word.length - 1;
    return word.charAt(0) != shuffled.charAt(0) ||
           word.charAt(last) != shuffled.charAt(last);
  }

  return function(word) {
    var wordArray = word.split("");
    var shuffled = word;

    while (!distant(word, shuffled)) {
      // Fisher-Yates shuffle
      for(var i = wordArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = wordArray[i];
        wordArray[i] = wordArray[j];
        wordArray[j] = tmp;
      }
      shuffled = wordArray.join('');
    }

    return shuffled;
  };
})();

/* jslint browser: true, jquery: true */

// Word to be guessed.
var currentWord = '';
var hintsGiven = 0;

// Timestamp for when the current word was first received.
var started;

// Object with controlling methods for the UI.
var mode;

function gotWord(data) {
  var word = data.word.toLowerCase();
  mode.newWord(word, shuffle(word));
  currentWord = word;
  started = new Date().getTime();
}

function getWord() {
  $.getJSON('word', {
    minLength: $('#minLength').val(),
    maxLength: $('#maxLength').val(),
  }, gotWord);
}

function endRound(correct) {
  var finished = new Date().getTime();
  var timeElapsed = finished - started;

  var record = $('<tr'+ (correct ? '' : ' class="missed"') + '>' +
    '<td class="word">' + currentWord + '</td>' +
    '<td class="time"><span>' + (timeElapsed / 1000).toFixed(1) + '</span></td>' +
    '</tr>');

  record.prependTo($('#finished')).fadeIn(300);
  hintsGiven = 0;
  mode.endRound();
  getWord();
}

$(function() {
  $('#skip').click(function() {
    endRound(false);
    mode.refocus();
  });
  $('#hint').click(function() {
    hintsGiven++;
    mode.hint(hintsGiven);
    mode.refocus();
  });
  $('#reshuffle').click(function() {
    mode.reshuffle(shuffle(currentWord));
    mode.refocus();
  });
  $('#toggle-hints').click(function() {
    if (this.checked) {
      $('#hint').show(200);
    } else {
      $('#hint').hide(200);
    }
  });

  $(document)
    .on('submit', function(e) {
      if (e.word == currentWord) {
        endRound(true);
      }
    })
    .on('click', 'a', function(e) {
      window.open($(this).attr('href'), '_blank');
      e.preventDefault();
    });

  getWord();
});
