'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
  var startCoords = {};
  var shift = {};
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

  function onMouseMove(moveEvt) {
    shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    setUserPinBlockCoords();
  }

  function setUserPinBlockCoords() {
    if (userPinBlock.offsetTop < 130) {
      userPinBlock.style.top = (130 - userPinBlock.offsetHeight) + 'px';
    } else if (userPinBlock.offsetTop > 630) {
      userPinBlock.style.top = (630 - userPinBlock.offsetHeight) + 'px';
    } else {
      userPinBlock.style.top = (userPinBlock.offsetTop - shift.y) + 'px';
    }

    if (userPinBlock.offsetLeft < 0) {
      userPinBlock.style.left = (0 - userPinBlock.offsetWidth / 2) + 'px';
    } else if (userPinBlock.offsetLeft > window.data.mapPinsBlock.offsetWidth) {
      userPinBlock.style.left = (window.data.mapPinsBlock.offsetWidth - userPinBlock.offsetWidth / 2) + 'px'
    } else {
      userPinBlock.style.left = (userPinBlock.offsetLeft - shift.x) + 'px';
    }
  }

  function mapPinMouseMoveHandler(moveEvt) { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAddress();
    onMouseMove(moveEvt);
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
