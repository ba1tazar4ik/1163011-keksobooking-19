// eslint-disable-next-line strict
(function () {
  var QUANTITY = 8;
  var userTimeIn = window.globalVariables.adFormBlock.querySelector('#timein');
  var userTimeOut = window.globalVariables.adFormBlock.querySelector('#timeout');

  function getAdvertisements(advertisementsQuantity) { // получаем объявления и метки на карте
    window.data(advertisementsQuantity);
    window.pin(advertisementsQuantity);
  }

  function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    window.form.getUserAdvertisementAddress();
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    window.globalVariables.mapPinsBlock.addEventListener('mousemove', mapPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    window.globalVariables.mapPinsBlock.removeEventListener('mousemove', mapPinMouseMoveHandler);
    document.removeEventListener('mouseup', userPinMouseUpHandler);
    window.globalVariables.userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  }

  function disableForms() { // функция выключает карту и формы
    window.globalVariables.userPinBlock.addEventListener('mousedown', userPinFirstMouseDownHandler);
    window.globalVariables.userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
    window.globalVariables.userPinBlock.addEventListener('keydown', userPinFirstKeyDownHandler);

    window.form.getUserAdvertisementAddress();
    window.form.toggleForm(true);
  }

  function userPinFirstMouseDownHandler(evt) { // функция запускает активацию сайта после клика на метке и убирает обработчик клика и нажатия Enter
    if (evt.button === 0) {
      activateForm();
    }
  }

  function userPinFirstKeyDownHandler(evt) { // функция запускает активацию сайта после нажатия Enter на метке и убирает обработчик клика и нажатия Enter
    if (evt.key === window.globalVariables.keycodeEnter) {
      activateForm();
    }
  }

  function activateForm() { // фнукция активирует форму, получает обьявления и снимает обработчики используемые для активации
    window.globalVariables.userPinBlock.removeEventListener('mousedown', userPinFirstMouseDownHandler);
    window.globalVariables.userPinBlock.removeEventListener('keydown', userPinFirstKeyDownHandler);
    window.globalVariables.userOfferType.addEventListener('change', window.form.setupOfferMinCost);
    window.globalVariables.adFormSubmit.addEventListener('click', window.form.submitClickHandler);
    userTimeIn.addEventListener('change', function () {
      window.form.setupUserTime(userTimeIn, userTimeOut);
    });
    userTimeOut.addEventListener('change', function () {
      window.form.setupUserTime(userTimeOut, userTimeIn);
    });

    window.form.toggleForm(false);
    getAdvertisements(QUANTITY);
    window.form.setupOfferMinCost();
  }


  // запускаем включение неактивного состояния сайта после его загрузки
  disableForms();
})();
