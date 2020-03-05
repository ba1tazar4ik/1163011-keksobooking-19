'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
  var startCoords = {};
  var shift = {};
  var userPinBlock = window.data.mapBlock.querySelector('.map__pin--main');
  var halfUserPinWidth = Math.floor(userPinBlock.offsetWidth / 2);

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

  userPinBlock.addEventListener('mousedown', function (evt) { // перетаскивание метки
    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var FULL_USER_PIN_HEIGHT = userPinBlock.offsetHeight + window.form.USER_PIN_TAIL_HEIGHT;
      var top = userPinBlock.offsetTop - shift.y;
      var minTop = window.data.MIN_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var maxTop = window.data.MAX_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var left = userPinBlock.offsetLeft - shift.x;
      var maxLeft = window.data.mapPinsBlock.offsetWidth - halfUserPinWidth;

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

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          userPinBlock.removeEventListener('click', onClickPreventDefault);
        };
        userPinBlock.addEventListener('click', onClickPreventDefault);
      }

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

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
