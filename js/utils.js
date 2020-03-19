'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  function debounce(timeoutHandler) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        timeoutHandler.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  function comparisonArray(firstArray, secondArray) {
    var flag;
    flag = secondArray.length > 0;
    for (var i = 0; i < firstArray.length; i++) {
      if (flag) {
        flag = searchForMatches(firstArray[i], secondArray, flag);
      } else {
        break;
      }
    }
    return flag;
  }

  function searchForMatches(firstArrayElement, secondArray, trigger) {
    for (var j = 0; j < secondArray.length; j++) {
      if (firstArrayElement === secondArray[j]) {
        trigger = true;
        break;
      } else {
        trigger = false;
      }
    }
    return trigger;
  }

  window.utils = {
    comparisonArray: comparisonArray,
    debounce: debounce
  };
})();
