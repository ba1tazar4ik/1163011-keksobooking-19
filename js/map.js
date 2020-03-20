'use strict';
(function () {
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var MAX_QUANTITY = 5;
  var USER_PIN_TAIL_HEIGHT = 15;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var startCoords = {};
  var shift = {};
  var userPinBlock = window.card.mapBlock.querySelector('.map__pin--main');
  var userPinBlockDefaultX = userPinBlock.offsetLeft;
  var userPinBlockDefaultY = userPinBlock.offsetTop;
  var mapPinsBlock = window.card.mapBlock.querySelector('.map__pins');
  var adFormBlock = document.querySelector('.ad-form');
  var userAddressInput = adFormBlock.querySelector('#address');
  var halfUserPinWidth = Math.floor(userPinBlock.offsetWidth / 2);
  var mapFiltersBlock = window.card.mapBlock.querySelector('.map__filters');
  var mapFiltersControls = mapFiltersBlock.querySelectorAll('select, input');
  var mapFilterOfType = mapFiltersBlock.querySelector('#housing-type');
  var mapFilterOfPrice = mapFiltersBlock.querySelector('#housing-price');
  var mapFilterOfRooms = mapFiltersBlock.querySelector('#housing-rooms');
  var mapFilterOfGuests = mapFiltersBlock.querySelector('#housing-guests');
  var mapFilterOfFeatures = mapFiltersBlock.querySelector('#housing-features');
  var offers = {};
  var similarOffers = {};

  function toggleMapFilters(booleanTrigger) {
    mapFiltersControls.forEach(function (current) {
      current.disabled = booleanTrigger;
    });
  }

  function onSuccess(data) { // создаем метки для обявлений
    offers = data;
    toggleMapFilters(false);
    getMapPins(offers.slice(0, MAX_QUANTITY));
    mapFiltersBlock.addEventListener('change', mapFiltersChangeHandler);
  }

  function onError(message) {
    window.console.error(message);
  }

  function mapFiltersChangeHandler() {
    getFilteredOffers(offers);
    window.utils.debounce(refreshMapPins());
  }

  function refreshMapPins() {
    removeMapPins();
    window.card.close();
    getMapPins(similarOffers.slice(0, MAX_QUANTITY));
  }

  function getFilteredOffers(data) {
    var selectedFeatures = [];
    mapFilterOfFeatures.querySelectorAll('input').forEach(function (current) {
      if (current.checked) {
        selectedFeatures.push(current.value);
      }
    });

    similarOffers = data.filter(function (it) {
      return mapFilterOfType.value === 'any' ? it : it.offer.type === mapFilterOfType.value;
    } && function (it) {
      return mapFilterOfRooms.value === 'any' ? it : it.offer.rooms === +mapFilterOfRooms.value;
    } && function (it) {
      return mapFilterOfGuests.value === 'any' ? it : it.offer.guests === +mapFilterOfGuests.value;
    } && function (it) {
      var flag;
      switch (mapFilterOfPrice.value) {
        case 'middle':
          flag = it.offer.price > LOW_PRICE && it.offer.price < HIGH_PRICE;
          break;

        case 'low':
          flag = it.offer.price <= LOW_PRICE;
          break;

        case 'high':
          flag = it.offer.price >= HIGH_PRICE;
          break;

        default:
          flag = true;
      }
      return flag;
    } && function (it) {
      return selectedFeatures.length <= 0 ? it : window.utils.comparisonArray(selectedFeatures, it.offer.features);
    });
  }

  function getMapPins(ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (currentAd) {
      fragment.appendChild(window.pin.render(currentAd));
    });
    mapPinsBlock.appendChild(fragment);
  }

  function removeMapPins() {
    var adPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < adPins.length; i++) {
      adPins[i].remove();
    }
  }

  function moveToDefaultCoordinatesUserPin() {
    userPinBlock.style.cssText = 'left: ' + userPinBlockDefaultX + 'px; top: ' + userPinBlockDefaultY + 'px;';
  }

  function userPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
    userAddressInput.value = (userPinBlock.offsetLeft + halfUserPinWidth) + ' , ' + (userPinBlock.offsetTop + userPinBlock.offsetHeight + USER_PIN_TAIL_HEIGHT);
  }

  function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
    document.addEventListener('mousemove', userPinMouseMoveHandler);
    document.addEventListener('mouseup', userPinMouseUpHandler);
  }

  function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
    document.removeEventListener('mousemove', userPinMouseMoveHandler);
    document.removeEventListener('mouseup', userPinMouseUpHandler);
    userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  }

  userPinBlock.addEventListener('mousedown', function (evt) { // перетаскивание метки
    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var dragged = false;

    function pinMoveHandler(moveEvt) {
      var fullUserPinHeight = userPinBlock.offsetHeight + USER_PIN_TAIL_HEIGHT;
      var top = userPinBlock.offsetTop - shift.y;
      var minTop = MIN_LOCATION_Y - fullUserPinHeight;
      var maxTop = MAX_LOCATION_Y - fullUserPinHeight;
      var left = userPinBlock.offsetLeft - shift.x;
      var maxLeft = mapPinsBlock.offsetWidth - halfUserPinWidth;
      dragged = true;

      moveEvt.preventDefault();

      shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      if (top <= minTop) {
        top = minTop;
      } else if (top >= maxTop) {
        top = maxTop;
      }

      if (left <= 0 - halfUserPinWidth) {
        left = -halfUserPinWidth;
      } else if (left >= maxLeft) {
        left = maxLeft;
      }

      userPinBlock.style.top = top + 'px';
      userPinBlock.style.left = left + 'px';
    }

    function pinClickPreventDefaultHandler(clickEvt) {
      clickEvt.preventDefault();
      userPinBlock.removeEventListener('click', pinClickPreventDefaultHandler);
    }

    function pinMouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', pinMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);

      if (dragged) {
        userPinBlock.addEventListener('click', pinClickPreventDefaultHandler);
      }
    }

    document.addEventListener('mousemove', pinMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });

  function removeHandlersOfMapFilters() {
    mapFiltersControls.forEach(function (current) {
      current.removeEventListener('change', mapFiltersChangeHandler);
    });
  }

  window.map = {
    USER_PIN_TAIL_HEIGHT: USER_PIN_TAIL_HEIGHT,
    adFormBlock: adFormBlock,
    userPinBlock: userPinBlock,
    userAddressInput: userAddressInput,
    toggleFilters: toggleMapFilters,
    removePins: removeMapPins,
    moveToDefaultCoordinatesUserPin: moveToDefaultCoordinatesUserPin,
    userPinMouseDownHandler: userPinMouseDownHandler,
    successDownloadData: onSuccess,
    errorDownloadData: onError,
    removeHandlersOfFilters: removeHandlersOfMapFilters
  };
})();
