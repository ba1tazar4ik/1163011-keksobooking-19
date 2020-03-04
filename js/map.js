'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
  var startCoords = {};
  var shift = {};
  var MAX_LOCATION_X = window.data.mapPinsBlock.offsetWidth;
  var userPinBlock = window.data.mapBlock.querySelector('.map__pin--main');

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

  function getUserPinBlockCoords(evt) {
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  }

  function changeUserPinBlockCoords(evt) {
    shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    setUserPinBlockCoords();
  }

  function setUserPinBlockCoords() {
    if (userPinBlock.offsetTop < window.data.MIN_LOCATION_Y - userPinBlock.offsetHeight) {
      userPinBlock.style.top = (window.data.MIN_LOCATION_Y - userPinBlock.offsetHeight) + 'px';
    } else if (userPinBlock.offsetTop > window.data.MAX_LOCATION_Y - userPinBlock.offsetHeight) {
      userPinBlock.style.top = (window.data.MAX_LOCATION_Y - userPinBlock.offsetHeight) + 'px';
    } else {
      userPinBlock.style.top = (userPinBlock.offsetTop - shift.y) + 'px';
    }

    if (userPinBlock.offsetLeft < userPinBlock.offsetWidth / 2) {
      userPinBlock.style.left = userPinBlock.offsetWidth / 2 + 'px';
    } else if (userPinBlock.offsetLeft > MAX_LOCATION_X - userPinBlock.offsetWidth / 2) {
      userPinBlock.style.left = (MAX_LOCATION_X - userPinBlock.offsetWidth / 2) + 'px';
    } else {
      userPinBlock.style.left = (userPinBlock.offsetLeft - shift.x) + 'px';
    }
  }

  function mapPinMouseMoveHandler(evt) { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAddress();
    changeUserPinBlockCoords(evt);
  }

  function userPinMouseDownHandler(evt) { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    getUserPinBlockCoords(evt);
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
