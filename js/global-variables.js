// eslint-disable-next-line strict
(function () {
  var KEYCODE_ENTER = 'Enter';
  var KEYCODE_ESCAPE = 'Escape';
  var ADVERTISEMENT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var advertisements = [];
  var mapBlock = document.querySelector('.map');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  var userPinBlock = mapBlock.querySelector('.map__pin--main');
  var adFormBlock = document.querySelector('.ad-form');
  var adFormSubmit = adFormBlock.querySelector('.ad-form__submit');
  var userOfferType = adFormBlock.querySelector('#type');

  window.globalVariables = {
    keycodeEnter: KEYCODE_ENTER,
    keycodeEscape: KEYCODE_ESCAPE,
    advertisementFeatures: ADVERTISEMENT_FEATURES,
    advertisements: advertisements,
    mapBlock: mapBlock,
    mapPinsBlock: mapPinsBlock,
    userPinBlock: userPinBlock,
    adFormBlock: adFormBlock,
    adFormSubmit: adFormSubmit,
    userOfferType: userOfferType
  };
})();
