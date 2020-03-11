'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var MAX_QUANTITY = 5;
  var startCoords = {};
  var shift = {};
  var userPinBlock = window.card.mapBlock.querySelector('.map__pin--main');
  var mapPinsBlock = window.card.mapBlock.querySelector('.map__pins');
  var halfUserPinWidth = Math.floor(userPinBlock.offsetWidth / 2);

  function onSuccess(data) { // создаем метки для обявлений
    var quantity = 0;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      if (data[i].offer && quantity < MAX_QUANTITY) {
        fragment.appendChild(window.pin.render(data[i]));
        quantity++;
      }
    }
    mapPinsBlock.appendChild(fragment);
  }

  function onError(message) {
    window.console.error(message);
  }

  function userPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAddress();
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
      var minTop = MIN_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var maxTop = MAX_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var left = userPinBlock.offsetLeft - shift.x;
      var maxLeft = mapPinsBlock.offsetWidth - halfUserPinWidth;

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

    window.load.fromServer(onSuccess, onError);
    window.form.startValidation();
    window.form.toggle(false);
  }

  // запускаем включение неактивного состояния сайта после его загрузки
  disableForms();

  window.map = {
    disableForms: disableForms
  };
})();
