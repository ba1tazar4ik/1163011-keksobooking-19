'use strict';
(function () {

  var userPinBlock = window.data.mapBlock.querySelector('.map__pin--main');


  userPinBlock.addEventListener('mousedown', function (evt) {
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(moveEvt) {
    shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    userPinBlock.style.top = (userPinBlock.offsetTop - shift.y) + 'px';
    userPinBlock.style.left = (userPinBlock.offsetLeft - shift.x) + 'px';

  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }


})();
