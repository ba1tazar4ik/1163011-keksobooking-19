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
      flag = secondArray.includes(firstArray[i]);
      if (!flag) {
        break;
      }
    }
    return flag;
  }

  window.utils = {
    comparisonArray: comparisonArray,
    debounce: debounce
  };
})();
