'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  function debounce(cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  function comparisonArray(firstArray, secondArray) {
    var flag;
    flag = secondArray.length >= firstArray.length;
    for (var i = 0; i < firstArray.length; i++) {
      if (flag) {
        for (var j = 0; j < secondArray.length; j++) {
          if (firstArray[i] === secondArray[j]) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }
      } else {
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
