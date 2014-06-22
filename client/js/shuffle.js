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
