'use strict';
(function () {
  var OFFER_MIN_COST = {flat: 1000, palace: 10000, house: 5000, bungalo: 0};
  var mapAndFilterBlocks = document.querySelectorAll('.map__filters, .ad-form');
  var userPinBlock = window.data.mapBlock.querySelector('.map__pin--main');
  var adFormBlock = document.querySelector('.ad-form');
  var adFormSubmit = adFormBlock.querySelector('.ad-form__submit');
  var userCapacity = adFormBlock.querySelector('#capacity');
  var userRoomNumber = adFormBlock.querySelector('#room_number');
  var userAddressInput = adFormBlock.querySelector('#address');
  var userPrice = adFormBlock.querySelector('#price');
  var userOfferType = adFormBlock.querySelector('#type');


  function validationUserCapacity() {
    if (userRoomNumber.value === '100') {
      userCapacity.setCustomValidity(userCapacity.value !== '0' ? 'Помещения на 100 комнат не для гостей' : '');
    } else {
      userCapacity.setCustomValidity(userCapacity.value > userRoomNumber.value || userCapacity.value === '0' ? 'В ' + userRoomNumber.value + ' комантах могут быть размещеные не менее 1 гостя и не более ' + userRoomNumber.value + ' гостей' : '');
    }
  }

  function toggleForm(booleanTrigger) { // функция переключает состояние форм
    window.data.mapBlock.classList.toggle('map--faded', booleanTrigger);
    adFormBlock.classList.toggle('ad-form--disabled', booleanTrigger);
    mapAndFilterBlocks.forEach(function (current) {
      current.querySelectorAll('select, input, textarea').forEach(function (currentValue) {
        currentValue.disabled = booleanTrigger;
      });
    });
    userAddressInput.readOnly = true;
  }

  function getUserAdvertisementAddress() { // функция записывает значение поля #address объявления пользовтеля
    userAddressInput.value = Math.floor(userPinBlock.offsetTop + userPinBlock.offsetHeight) + ' , ' + Math.floor(userPinBlock.offsetLeft + userPinBlock.offsetWidth / 2);
  }

  function setupOfferMinCost() {
    userPrice.placeholder = OFFER_MIN_COST[userOfferType.value];
    userPrice.min = OFFER_MIN_COST[userOfferType.value];
  }

  function setupUserTime(firstTime, secondTime) {
    secondTime.value = firstTime.value;
  }

  function submitClickHandler(evt) {
    evt.preventDefault();
    validationUserCapacity();
    adFormBlock.requestSubmit(adFormSubmit);
  }
  window.form = {
    adFormBlock: adFormBlock,
    toggle: toggleForm,
    getUserAddress: getUserAdvertisementAddress,
    setupMinCost: setupOfferMinCost,
    setupUserTime: setupUserTime,
    submitHandler: submitClickHandler
  };
})();
