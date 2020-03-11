'use strict';
(function () {
  var USER_PIN_BLOCK_DEFAULT_COORDS = {x: 570, y: 375};
  var mainBlock = document.querySelector('main');
  var successUploadTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var successBlock = successUploadTemplate.cloneNode(true);
  var errorUploadTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var errorBlock = errorUploadTemplate.cloneNode(true);

  function resetAllData() {
    removeMapPins();
    moveToDefaultCordsUserPin();
    window.form.adFormBlock.reset();
    window.map.disableForms();
    window.card.close();
  }

  function removeMapPins() {
    var adPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < adPins.length; i++) {
      window.card.mapBlock.querySelector('.map__pins').removeChild(adPins[i]);
    }
  }

  function moveToDefaultCordsUserPin() {
    window.form.userPinBlock.style.cssText = 'left: ' + USER_PIN_BLOCK_DEFAULT_COORDS.x + 'px; top: ' + USER_PIN_BLOCK_DEFAULT_COORDS.y + 'px;';
  }

  function uploadForm(evt) {
    window.load.toServer(new FormData(window.form.adFormBlock), onSuccessUpload, onErrorUpload);
    evt.preventDefault();
  }

  function onSuccessUpload() {
    mainBlock.appendChild(successBlock);

    successBlock.addEventListener('click', function () {
      mainBlock.removeChild(successBlock);
    });
    document.addEventListener('keydown', removeSuccessBlock);

    resetAllData();
  }

  function removeSuccessBlock(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      mainBlock.removeChild(successBlock);
      document.removeEventListener('keydown', removeSuccessBlock);
    }
  }

  function onErrorUpload(message) {
    window.console.error(message);

    mainBlock.appendChild(errorBlock);
    document.addEventListener('keydown', removeErrorBlockByEscape);
    errorBlock.querySelector('.error__button').addEventListener('click', removeErrorBlock);
    errorBlock.querySelector('.error__message').addEventListener('click', stopPropagationOnErrorMessage);
    errorBlock.addEventListener('click', removeErrorBlock);
  }

  function stopPropagationOnErrorMessage(evt) {
    evt.stopPropagation();
  }

  function removeErrorBlock(evt) {
    document.removeEventListener('keydown', removeErrorBlock);
    errorBlock.querySelector('.error__message').removeEventListener('click', stopPropagationOnErrorMessage);
    mainBlock.removeChild(errorBlock);

    evt.preventDefault();
  }

  function removeErrorBlockByEscape(evt) {
    if (evt.key === window.card.KEYCODE_ESCAPE) {
      removeErrorBlock();
    }
  }

  window.form.adFormBlock.addEventListener('submit', uploadForm);
  document.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
    resetAllData();
    evt.preventDefault();
  });
})();
