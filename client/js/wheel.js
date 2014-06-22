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