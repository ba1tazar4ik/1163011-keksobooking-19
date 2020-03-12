'use strict';
(function () {
  var KEYCODE_ENTER = 'Enter';
  var OFFER_MIN_COST = {flat: 1000, palace: 10000, house: 5000, bungalo: 0};
  var mainBlock = document.querySelector('main');
  var mapAndFilterBlocks = document.querySelectorAll('.map__filters, .ad-form');
  var adFormSubmit = window.map.adFormBlock.querySelector('.ad-form__submit');
  var adFormReset = document.querySelector('.ad-form__reset');
  var userCapacity = window.map.adFormBlock.querySelector('#capacity');
  var userRoomNumber = window.map.adFormBlock.querySelector('#room_number');
  var userPrice = window.map.adFormBlock.querySelector('#price');
  var userOfferType = window.map.adFormBlock.querySelector('#type');
  var userTimeIn = window.map.adFormBlock.querySelector('#timein');
  var userTimeOut = window.map.adFormBlock.querySelector('#timeout');
  var successUploadTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorUploadTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var errorBlock;
  var successBlock;
  var defaultUserAddressInputValue = {x: window.map.userPinBlock.offsetLeft + Math.floor(window.map.userPinBlock.offsetWidth / 2),
    y: window.map.userPinBlock.offsetTop + window.map.userPinBlock.offsetHeight + window.map.USER_PIN_TAIL_HEIGHT
  };


  function validationUserCapacity() {
    if (userRoomNumber.value === '100') {
      userCapacity.setCustomValidity(userCapacity.value !== '0' ? 'Помещения на 100 комнат не для гостей' : '');
    } else {
      userCapacity.setCustomValidity(userCapacity.value > userRoomNumber.value || userCapacity.value === '0' ? 'В ' + userRoomNumber.value + ' комантах могут быть размещеные не менее 1 гостя и не более ' + userRoomNumber.value + ' гостей' : '');
    }
  }

  function toggleForm(booleanTrigger) { // функция переключает состояние форм
    window.card.mapBlock.classList.toggle('map--faded', booleanTrigger);
    window.map.adFormBlock.classList.toggle('ad-form--disabled', booleanTrigger);
    mapAndFilterBlocks.forEach(function (current) {
      current.querySelectorAll('select, input, textarea').forEach(function (currentValue) {
        currentValue.disabled = booleanTrigger;
      });
    });
    window.map.userAddressInput.readOnly = true;
  }

  function setupOfferMinCost() {
    userPrice.placeholder = OFFER_MIN_COST[userOfferType.value];
    userPrice.min = OFFER_MIN_COST[userOfferType.value];
  }

  function setupUserTime(firstTime, secondTime) {
    secondTime.value = firstTime.value;
  }

  function submitButtonClickHandler() {
    validationUserCapacity();
  }

  function startValidationForm() {
    userOfferType.addEventListener('change', function () {
      setupOfferMinCost();
    });
    adFormSubmit.addEventListener('click', submitButtonClickHandler);
    userTimeIn.addEventListener('change', function () {
      setupUserTime(userTimeIn, userTimeOut);
    });
    userTimeOut.addEventListener('change', function () {
      setupUserTime(userTimeOut, userTimeIn);
    });

    setupOfferMinCost();
  }

  function disableForms() { // функция выключает карту и формы
    window.map.userPinBlock.addEventListener('mousedown', userPinFirstMouseDownHandler);
    window.map.userPinBlock.addEventListener('mousedown', window.map.userPinMouseDownHandler);
    window.map.userPinBlock.addEventListener('keydown', userPinFirstKeyDownHandler);

    window.map.userAddressInput.value = defaultUserAddressInputValue.x + ',' + defaultUserAddressInputValue.y;
    toggleForm(true);
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
    window.map.userPinBlock.removeEventListener('mousedown', userPinFirstMouseDownHandler);
    window.map.userPinBlock.removeEventListener('keydown', userPinFirstKeyDownHandler);

    window.load.fromServer(window.map.successDownloadData, window.map.errorDownloadData);
    startValidationForm();
    toggleForm(false);
  }

  function resetAllData() {
    window.map.removePins();
    window.map.moveToDefaultCoordinatesUserPin();
    window.map.adFormBlock.reset();
    disableForms();
    window.card.close();
  }

  function adFormBlockSubmitHandler(evt) {
    window.load.toServer(new FormData(window.map.adFormBlock), onSuccessUpload, onErrorUpload);
    evt.preventDefault();
  }

  function onSuccessUpload() {
    successBlock = successUploadTemplate.cloneNode(true);
    mainBlock.appendChild(successBlock);

    successBlock.addEventListener('click', function () {
      successBlock.remove();
    });
    document.addEventListener('keydown', successBlockKeydownEscapeHandler);

    resetAllData();
    return successBlock;
  }

  function successBlockKeydownEscapeHandler(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      successBlock.remove();
      document.removeEventListener('keydown', successBlockKeydownEscapeHandler);
    }
  }

  function onErrorUpload(message) {
    window.console.error(message);

    errorBlock = errorUploadTemplate.cloneNode(true);
    mainBlock.appendChild(errorBlock);
    document.addEventListener('keydown', errorBlockKeydownEscapeHandler);
    errorBlock.querySelector('.error__button').addEventListener('click', errorButtonMouseClickHandler);
    errorBlock.querySelector('.error__message').addEventListener('click', errorMessageMouseClickHandler);
    errorBlock.addEventListener('click', function () {
      removeErrorBlock();
    });

    return errorBlock;
  }

  function errorMessageMouseClickHandler(evt) {
    evt.stopPropagation();
  }

  function errorButtonMouseClickHandler() {
    removeErrorBlock();
  }

  function errorBlockKeydownEscapeHandler(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      removeErrorBlock();
    }
  }

  function removeErrorBlock() {
    document.removeEventListener('keydown', errorBlockKeydownEscapeHandler);
    errorBlock.querySelector('.error__message').removeEventListener('click', errorMessageMouseClickHandler);
    errorBlock.querySelector('.error__button').removeEventListener('click', errorButtonMouseClickHandler);
    errorBlock.remove();
  }

  // запускаем включение неактивного состояния сайта после его загрузки
  disableForms();

  window.map.adFormBlock.addEventListener('submit', adFormBlockSubmitHandler);
  adFormReset.addEventListener('click', function (evt) {
    resetAllData();
    evt.preventDefault();
  });
})();
