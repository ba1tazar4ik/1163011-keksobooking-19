// eslint-disable-next-line strict
(function () {
// НАЧАЛО ВАЛИДАЦИИ
  function validationUserCapacity() {
    userCapacity.setCustomValidity(
      userCapacity.value > userRoomNumber.value ? ('В ' + userRoomNumber.value + ' комантах могут быть размещеные не более ' + userRoomNumber.value + ' гостей') : (''),
    );
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

// КОНЕЦ ВАЛИДАЦИИ

  function getUserAdvertisementAddress() { // функция записывает значение поля #address объявления пользовтеля
    userAddressInput.value = Math.floor(userPinBlock.offsetTop + userPinBlock.offsetHeight) + ' , ' + Math.floor(userPinBlock.offsetLeft + userPinBlock.offsetWidth / 2);
  }

  function toggleForm(booleanTrigger) { // функция переключает состояние форм
    mapBlock.classList.toggle('map--faded', booleanTrigger);
    adFormBlock.classList.toggle('ad-form--disabled', booleanTrigger);
    mapAndFilterBlocks.forEach(function (current) {
      current.querySelectorAll('select, input, textarea').forEach(function (currentValue) {
        currentValue.disabled = booleanTrigger;
      });
    });
    userAddressInput.readOnly = true;
  }

  function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    getUserAdvertisementAddress();
  }

  function activateForm() { // фнукция активирует форму, получает обьявления и снимает обработчики используемые для активации
    userPinBlock.removeEventListener('mousedown', userPinFirstMouseDownHandler);
    userPinBlock.removeEventListener('keydown', userPinFirstKeyDownHandler);
    userOfferType.addEventListener('change', setupOfferMinCost);
    adFormSubmit.addEventListener('click', submitClickHandler);
    userTimeIn.addEventListener('change', function () {
      setupUserTime(userTimeIn, userTimeOut);
    });
    userTimeOut.addEventListener('change', function () {
      setupUserTime(userTimeOut, userTimeIn);
    });

    toggleForm(false);
    getAdvertisements(QUANTITY);
    setupOfferMinCost();
  }
})();
