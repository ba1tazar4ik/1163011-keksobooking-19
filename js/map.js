'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
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

  function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAddress();
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    window.data.mapPinsBlock.addEventListener('mousemove', mapPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    window.data.mapPinsBlock.removeEventListener('mousemove', mapPinMouseMoveHandler);
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
