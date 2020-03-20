'use strict';
(function () {
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var USER_PIN_TAIL_HEIGHT = 15;
  var startCoords = {};
  var shift = {};
  var userPinBlock = window.adPins.mapPinsBlock.querySelector('.map__pin--main');
  var userPinBlockDefaultX = userPinBlock.offsetLeft;
  var userPinBlockDefaultY = userPinBlock.offsetTop;
  var adFormBlock = document.querySelector('.ad-form');
  var userAddressInput = adFormBlock.querySelector('#address');
  var halfUserPinWidth = Math.floor(userPinBlock.offsetWidth / 2);

  function moveToDefaultCoordinatesUserPin() {
    userPinBlock.style.cssText = 'left: ' + userPinBlockDefaultX + 'px; top: ' + userPinBlockDefaultY + 'px;';
  }

  function userPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    userAddressInput.value = (userPinBlock.offsetLeft + halfUserPinWidth) + ' , ' + (userPinBlock.offsetTop + userPinBlock.offsetHeight + USER_PIN_TAIL_HEIGHT);
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    document.addEventListener('mousemove', userPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    document.removeEventListener('mousemove', userPinMouseMoveHandler);
    document.removeEventListener('mouseup', userPinMouseUpHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  }

  userPinBlock.addEventListener('mousedown', function (evt) { // перетаскивание метки
    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var dragged = false;

    function pinMoveHandler(moveEvt) {
      var fullUserPinHeight = userPinBlock.offsetHeight + USER_PIN_TAIL_HEIGHT;
      var top = userPinBlock.offsetTop - shift.y;
      var minTop = MIN_LOCATION_Y - fullUserPinHeight;
      var maxTop = MAX_LOCATION_Y - fullUserPinHeight;
      var left = userPinBlock.offsetLeft - shift.x;
      var maxLeft = window.adPins.mapPinsBlock.offsetWidth - halfUserPinWidth;
      dragged = true;

      moveEvt.preventDefault();

      shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      if (top <= minTop) {
        top = minTop;
      } else if (top >= maxTop) {
        top = maxTop;
      }

      if (left <= 0 - halfUserPinWidth) {
        left = -halfUserPinWidth;
      } else if (left >= maxLeft) {
        left = maxLeft;
      }

      userPinBlock.style.top = top + 'px';
      userPinBlock.style.left = left + 'px';
    }

    function pinClickPreventDefaultHandler(clickEvt) {
      clickEvt.preventDefault();
      userPinBlock.removeEventListener('click', pinClickPreventDefaultHandler);
    }

    function pinMouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', pinMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);

      if (dragged) {
        userPinBlock.addEventListener('click', pinClickPreventDefaultHandler);
      }
    }

    document.addEventListener('mousemove', pinMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });

  window.map = {
    USER_PIN_TAIL_HEIGHT: USER_PIN_TAIL_HEIGHT,
    adFormBlock: adFormBlock,
    userPinBlock: userPinBlock,
    userAddressInput: userAddressInput,
    moveToDefaultCoordinatesUserPin: moveToDefaultCoordinatesUserPin,
    userPinMouseDownHandler: userPinMouseDownHandler,
  };
})();
