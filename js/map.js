'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var QUANTITY = 8;
  var mapBlock = document.querySelector('.map');
  var userPinBlock = mapBlock.querySelector('.map__pin--main');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  var adFormBlock = document.querySelector('.ad-form');
  var userTimeIn = adFormBlock.querySelector('#timein');
  var userTimeOut = adFormBlock.querySelector('#timeout');
  var userOfferType = adFormBlock.querySelector('#type');
  var adFormSubmit = adFormBlock.querySelector('.ad-form__submit');

  function getAdvertisements(advertisementsQuantity) { // получаем объявления и метки на карте
    window.data.generate(advertisementsQuantity);
    window.pin.generate(advertisementsQuantity);
  }

  function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    window.form.userAddress();
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    mapPinsBlock.addEventListener('mousemove', mapPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    mapPinsBlock.removeEventListener('mousemove', mapPinMouseMoveHandler);
    document.removeEventListener('mouseup', userPinMouseUpHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  }

  function disableForms() { // функция выключает карту и формы
    userPinBlock.addEventListener('mousedown', userPinFirstMouseDownHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
    userPinBlock.addEventListener('keydown', userPinFirstKeyDownHandler);

    window.form.userAddress();
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
    userOfferType.addEventListener('change', window.form.minCost);
    adFormSubmit.addEventListener('click', window.form.submitHandler);
    userTimeIn.addEventListener('change', function () {
      window.form.userTime(userTimeIn, userTimeOut);
    });
    userTimeOut.addEventListener('change', function () {
      window.form.userTime(userTimeOut, userTimeIn);
    });

    window.form.toggle(false);
    getAdvertisements(QUANTITY);
    window.form.minCost();
  }

  // запускаем включение неактивного состояния сайта после его загрузки
  disableForms();
})();
