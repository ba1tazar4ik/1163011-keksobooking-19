'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
  var topCoords;
  var leftCoords;
  var startCoords = {};
  var shift = {};
  var userPinBlock = window.data.mapBlock.querySelector('.map__pin--main');
  var minCoordsY = Math.floor(userPinBlock.parentNode.getBoundingClientRect().y) + window.data.MIN_LOCATION_Y - userPinBlock.offsetHeight;
  var maxCoordsY = Math.floor(userPinBlock.parentNode.getBoundingClientRect().y) + window.data.MAX_LOCATION_Y - userPinBlock.offsetHeight;
  var minCoordsX = Math.floor(userPinBlock.parentNode.getBoundingClientRect().x) - Math.floor(userPinBlock.offsetWidth / 2);
  var maxCoordsX = Math.floor(userPinBlock.parentNode.getBoundingClientRect().x + window.data.mapPinsBlock.offsetWidth - userPinBlock.offsetWidth / 2);

  function generateAdvertisementPins(advertisementsQuantity) { // создаем метки для обявлений
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertisementsQuantity; i++) {
      fragment.appendChild(window.pin.render(window.data.advertisements[i]));
    }

    window.data.mapPinsBlock.appendChild(fragment);
  }

  function getAdvertisements(advertisementsQuantity) { // получаем объявления и метки на карте
    window.data.generate(advertisementsQuantity);
    generateAdvertisementPins(advertisementsQuantity);
  }

  (function () {
    userPinBlock.addEventListener('mousedown', function (evt) {
      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        if (startCoords.y < minCoordsY) {
          topCoords = (window.data.MIN_LOCATION_Y - userPinBlock.offsetHeight) + 'px';
        } else if (startCoords.y > maxCoordsY) {
          topCoords = (window.data.MAX_LOCATION_Y - userPinBlock.offsetHeight) + 'px';
        } else {
          topCoords = (userPinBlock.offsetTop - shift.y) + 'px';
        }

        if (startCoords.x < minCoordsX) {
          leftCoords = (0 - Math.floor(userPinBlock.offsetWidth / 2)) + 'px';
        } else if (startCoords.x > maxCoordsX) {
          leftCoords = Math.floor(window.data.mapPinsBlock.offsetWidth - userPinBlock.offsetWidth / 2) + 'px';
        } else {
          leftCoords = (userPinBlock.offsetLeft - shift.x) + 'px';
        }
        userPinBlock.style.top = topCoords;
        userPinBlock.style.left = leftCoords;

      };

      var onMouseUp = function () {

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });


  })();

  function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAddress();
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    document.addEventListener('mousemove', mapPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    document.removeEventListener('mousemove', mapPinMouseMoveHandler);
    document.removeEventListener('mouseup', userPinMouseUpHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  }

  function disableForms() { // функция выключает карту и формы
    userPinBlock.addEventListener('mousedown', userPinFirstMouseDownHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
    userPinBlock.addEventListener('keydown', userPinFirstKeyDownHandler);

    window.form.getUserAddress();
    window.form.toggle(true);
  }

  function userPinFirstMouseDownHandler(evt) { // функция запускает активацию сайта после клика на метке и убирает обработчик клика и нажатия Enter
    if (evt.button === 0) {
      activateForm();
    }
  }

  function userPinFirstKeyDownHandler(evt) { // функция запускает активацию сайта после нажатия Enter на метке и убирает обработчик клика и нажатия Enter
    if (evt.key === KEYCODE_ENTER) {
      activateForm();
    }
  }

  function activateForm() { // фнукция активирует форму, получает обьявления и снимает обработчики используемые для активации
    userPinBlock.removeEventListener('mousedown', userPinFirstMouseDownHandler);
    userPinBlock.removeEventListener('keydown', userPinFirstKeyDownHandler);

    getAdvertisements(QUANTITY);
    window.form.startValidation();
    window.form.toggle(false);
  }

  // запускаем включение неактивного состояния сайта после его загрузки
  disableForms();
})();
