// eslint-disable-next-line strict
(function () {
  var OFFER_MIN_COST = {flat: 1000, palace: 10000, house: 5000, bungalo: 0};
  var mapAndFilterBlocks = document.querySelectorAll('.map__filters, .ad-form');
  var userCapacity = window.globalVariables.adFormBlock.querySelector('#capacity');
  var userRoomNumber = window.globalVariables.adFormBlock.querySelector('#room_number');
  var userAddressInput = window.globalVariables.adFormBlock.querySelector('#address');
  var userPrice = window.globalVariables.adFormBlock.querySelector('#price');

  function validationUserCapacity() {
    userCapacity.setCustomValidity(
        userCapacity.value > userRoomNumber.value ? ('В ' + userRoomNumber.value + ' комантах могут быть размещеные не более ' + userRoomNumber.value + ' гостей') : ('')
    );
  }

  window.form = {
    toggleForm:
      function toggleForm(booleanTrigger) { // функция переключает состояние форм
        window.globalVariables.mapBlock.classList.toggle('map--faded', booleanTrigger);
        window.globalVariables.adFormBlock.classList.toggle('ad-form--disabled', booleanTrigger);
        mapAndFilterBlocks.forEach(function (current) {
          current.querySelectorAll('select, input, textarea').forEach(function (currentValue) {
            currentValue.disabled = booleanTrigger;
          });
        });
        userAddressInput.readOnly = true;
      },
    getUserAdvertisementAddress:
      function getUserAdvertisementAddress() { // функция записывает значение поля #address объявления пользовтеля
        userAddressInput.value = Math.floor(window.globalVariables.userPinBlock.offsetTop + window.globalVariables.userPinBlock.offsetHeight) + ' , ' + Math.floor(window.globalVariables.userPinBlock.offsetLeft + window.globalVariables.userPinBlock.offsetWidth / 2);
      },
    setupOfferMinCost:
      function setupOfferMinCost() {
        userPrice.placeholder = OFFER_MIN_COST[window.globalVariables.userOfferType.value];
        userPrice.min = OFFER_MIN_COST[window.globalVariables.userOfferType.value];
      },
    setupUserTime:
      function setupUserTime(firstTime, secondTime) {
        secondTime.value = firstTime.value;
      },
    submitClickHandler:
      function submitClickHandler(evt) {
        evt.preventDefault();
        validationUserCapacity();
        window.globalVariables.adFormBlock.requestSubmit(window.globalVariables.adFormSubmit);
      },
  };
})();
