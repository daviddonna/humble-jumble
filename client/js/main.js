/* jslint browser: true, jquery: true */

// Word to be guessed.
var currentWord = '';

// Timestamp for when the current word was first received.
var started;

// Object with controlling methods for the UI.
var mode = flat;

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
  mode.endRound();
  getWord();
}

$(function() {
  $('#skip').click(function() { endRound(false); });
  $('#hint').click(function() { mode.hint(); });
  $('#reshuffle').click(function() {
    mode.reshuffle(shuffle(currentWord));
  });

  $(document).on('submit', function(e) {
    if (e.word == currentWord) {
      endRound(true);
    }
  });

  getWord();
});
