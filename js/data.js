'use strict';
(function () {
  var USER_PIN_BLOCK_DEFAULT_COORDS = {x: 570, y: 375};
  var mainBlock = document.querySelector('main');
  var adFormReset = document.querySelector('.ad-form__reset');
  var successUploadTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var errorUploadTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var errorBlock;
  var successBlock;

  function resetAllData() {
    removeMapPins();
    moveToDefaultCoordinatesUserPin();
    window.form.adFormBlock.reset();
    window.map.disableForms();
    window.card.close();
  }

  function removeMapPins() {
    var adPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < adPins.length; i++) {
      adPins[i].remove();
    }
  }

  function moveToDefaultCoordinatesUserPin() {
    window.form.userPinBlock.style.cssText = 'left: ' + USER_PIN_BLOCK_DEFAULT_COORDS.x + 'px; top: ' + USER_PIN_BLOCK_DEFAULT_COORDS.y + 'px;';
  }

  function submitHandler(evt) {
    window.load.toServer(new FormData(window.form.adFormBlock), onSuccessUpload, onErrorUpload);
    evt.preventDefault();
  }

  function onSuccessUpload() {
    successBlock = successUploadTemplate.cloneNode(true);
    mainBlock.appendChild(successBlock);

    successBlock.addEventListener('click', function () {
      successBlock.remove();
    });
    document.addEventListener('keydown', onSuccessBlockKeydownEscapeHandler);

    resetAllData();
    return successBlock;
  }

  function onSuccessBlockKeydownEscapeHandler(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      successBlock.remove();
      document.removeEventListener('keydown', onSuccessBlockKeydownEscapeHandler);
    }
  }

  function onErrorUpload(message) {
    window.console.error(message);

    errorBlock = errorUploadTemplate.cloneNode(true);
    mainBlock.appendChild(errorBlock);
    document.addEventListener('keydown', onErrorBlockKeydownEscapeHandler);
    errorBlock.querySelector('.error__button').addEventListener('click', onErrorButtonMouseClickHandler);
    errorBlock.querySelector('.error__message').addEventListener('click', onErrorMessageMouseClickHandler);
    errorBlock.addEventListener('click', function () {
      removeErrorBlock();
    });

    return errorBlock;
  }

  function onErrorMessageMouseClickHandler(evt) {
    evt.stopPropagation();
  }

  function onErrorButtonMouseClickHandler() {
    removeErrorBlock();
  }

  function onErrorBlockKeydownEscapeHandler(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      removeErrorBlock();
    }
  }

  function removeErrorBlock() {
    document.removeEventListener('keydown', onErrorBlockKeydownEscapeHandler);
    errorBlock.querySelector('.error__message').removeEventListener('click', onErrorMessageMouseClickHandler);
    errorBlock.querySelector('.error__button').removeEventListener('click', onErrorButtonMouseClickHandler);
    errorBlock.remove();
  }

  window.form.adFormBlock.addEventListener('submit', submitHandler);
  adFormReset.addEventListener('click', function (evt) {
    resetAllData();
    evt.preventDefault();
  });
})();
