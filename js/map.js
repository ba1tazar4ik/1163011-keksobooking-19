'use strict';
(function () {
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var MAX_QUANTITY = 5;
  var USER_PIN_TAIL_HEIGHT = 15;
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
    window.utils.debounce(refreshMapPins);
  }

  function refreshMapPins() {
    removeMapPins();
    window.card.close();
    getMapPins(similarOffers.slice(0, MAX_QUANTITY));
  }

  function getSimilarByHousingType(data) {
    return data.filter(function (it) {
      return mapFilterOfType.value === 'any' ? it : it.offer.type === mapFilterOfType.value;
    });
  }

  function getSimilarByHousingPrice(data) {
    return data.filter(function (it) {
      switch (mapFilterOfPrice.value) {
        case 'middle':
          return it.offer.price > 10000 && it.offer.price < 50000;
          break;

        case 'low':
          return it.offer.price <= 10000;
          break;

        case 'high':
          return it.offer.price >= 50000;
          break;

        default:
          return it;
      }
    });
  }

  function getSimilarByHousingRooms(data) {
    return data.filter(function (it) {
      return mapFilterOfRooms.value === 'any' ? it : it.offer.rooms === +mapFilterOfRooms.value;
    });
  }

  function getSimilarByHousingGuests(data) {
    return data.filter(function (it) {
      return mapFilterOfGuests.value === 'any' ? it : it.offer.guests === +mapFilterOfGuests.value;
    });
  }

  function getSimilarByHousingFeatures(data) {
    var selectedFeatures = [];
    mapFilterOfFeatures.querySelectorAll('input').forEach(function (current) {
      if (current.checked) {
        selectedFeatures.push(current.value);
      }
    });
    return data.filter(function (it) {
      return selectedFeatures.length <= 0 ? it : window.utils.comparisonArray(selectedFeatures, it.offer.features);
    });
  }

  function getFilteredOffers(data) {
    similarOffers = getSimilarByHousingType(data);
    similarOffers = getSimilarByHousingRooms(similarOffers);
    similarOffers = getSimilarByHousingGuests(similarOffers);
    similarOffers = getSimilarByHousingPrice(similarOffers);
    similarOffers = getSimilarByHousingFeatures(similarOffers);
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

    var pinMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var FULL_USER_PIN_HEIGHT = userPinBlock.offsetHeight + USER_PIN_TAIL_HEIGHT;
      var top = userPinBlock.offsetTop - shift.y;
      var minTop = MIN_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var maxTop = MAX_LOCATION_Y - FULL_USER_PIN_HEIGHT;
      var left = userPinBlock.offsetLeft - shift.x;
      var maxLeft = mapPinsBlock.offsetWidth - halfUserPinWidth;

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

    };

    var pinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', pinMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);

      if (dragged) {
        var pinClickPreventDefaultHandler = function (clickEvt) {
          clickEvt.preventDefault();
          userPinBlock.removeEventListener('click', pinClickPreventDefaultHandler);
        };
        userPinBlock.addEventListener('click', pinClickPreventDefaultHandler);
      }

    };

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
