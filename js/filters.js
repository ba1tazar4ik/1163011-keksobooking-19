'use strict';
(function () {
  var MAX_QUANTITY = 5;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var mapPinsBlock = window.card.mapBlock.querySelector('.map__pins');
  var mapFiltersBlock = window.card.mapBlock.querySelector('.map__filters');
  var mapFiltersControls = mapFiltersBlock.querySelectorAll('select, input');
  var mapFilterOfType = mapFiltersBlock.querySelector('#housing-type');
  var mapFilterOfPrice = mapFiltersBlock.querySelector('#housing-price');
  var mapFilterOfRooms = mapFiltersBlock.querySelector('#housing-rooms');
  var mapFilterOfGuests = mapFiltersBlock.querySelector('#housing-guests');
  var mapFilterOfFeatures = mapFiltersBlock.querySelector('#housing-features');
  var similarOffers = {};

  function toggleMapFilters(booleanTrigger) {
    mapFiltersControls.forEach(function (current) {
      current.disabled = booleanTrigger;
    });
  }

  function refreshMapPins() {
    removeMapPins();
    window.card.close();
    getMapPins(similarOffers.slice(0, MAX_QUANTITY));
  }

  function filtersByType(ad) {
    return mapFilterOfType.value === 'any' || ad.offer.type === mapFilterOfType.value;
  }

  function filtersByRooms(ad) {
    return mapFilterOfRooms.value === 'any' || ad.offer.rooms === +mapFilterOfRooms.value;
  }

  function filtersByGuests(ad) {
    return mapFilterOfGuests.value === 'any' || ad.offer.guests === +mapFilterOfGuests.value;
  }

  function filtersByPrice(ad) {
    var flag;
    switch (mapFilterOfPrice.value) {
      case 'middle':
        flag = ad.offer.price > LOW_PRICE && ad.offer.price < HIGH_PRICE;
        break;

      case 'low':
        flag = ad.offer.price <= LOW_PRICE;
        break;

      case 'high':
        flag = ad.offer.price >= HIGH_PRICE;
        break;

      default:
        flag = true;
    }
    return flag;
  }

  function filtersByFeatures(ad) {
    var selectedFeatures = [];
    mapFilterOfFeatures.querySelectorAll('input:checked').forEach(function (current) {
      selectedFeatures.push(current.value);
    });
    return selectedFeatures.length <= 0 || window.utils.comparisonArray(selectedFeatures, ad.offer.features);
  }

  function getFilteredOffers(data) {
    similarOffers = data.filter(function (it) {
      return filtersByType(it) && filtersByRooms(it) && filtersByGuests(it) && filtersByPrice(it) && filtersByFeatures(it);
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
    var adPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < adPins.length; i++) {
      adPins[i].remove();
    }
  }

  window.filters = {
    MAX_QUANTITY: MAX_QUANTITY,
    block: mapFiltersBlock,
    controls: mapFiltersControls,
    mapPinsBlock: mapPinsBlock,
    toggle: toggleMapFilters,
    getFilteredOffers: getFilteredOffers,
    getMapPins: getMapPins,
    refreshMapPins: refreshMapPins,
    removeMapPins: removeMapPins
  };
})();
