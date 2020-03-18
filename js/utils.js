'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  var flag;

  function comparisonArray(firstArray, secondArray) {
    if (firstArray.length > secondArray.length) {
      flag = false;
    } else {
      firstArray.forEach(function (current) {
        flag = secondArray.includes(current);
      });
    }
    return flag;
  }

  function debounce(timeoutHandler) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(timeoutHandler, DEBOUNCE_INTERVAL);
  }

  window.utils = {
    comparisonArray: comparisonArray,
    debounce: debounce
  };
})();
