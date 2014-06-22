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

    hint: function() {
      $('.answer-letter').html('');
      $('.answer-letter-container')
        .removeClass('focus')
        .first()
        .addClass('focus');
      addLetter(currentWord.charAt(0));
      analyzeUsage();
    },

    endRound: function() {
      $(document).off('keypress');
    },

    reshuffle: function(shuffled) {
      displayShuffled(shuffled);
    },
  };
})();