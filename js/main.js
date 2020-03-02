// eslint-disable-next-line strict
var KEY_ENTER = 'Enter';
var KEYCODE_ESCAPE = 'Escape';






var OFFER_TYPE = {flat: 'Квартира', palace: 'Дворец', house: 'Дом', bungalo: 'Бунгало'};
var OFFER_MIN_COST = {flat: 1000, palace: 10000, house: 5000, bungalo: 0};
var QUANTITY = 8;

var userPinBlock = mapBlock.querySelector('.map__pin--main');

var mapFiltersBlock = mapBlock.querySelector('.map__filters-container');
var adFormBlock = document.querySelector('.ad-form');
var adFormSubmit = adFormBlock.querySelector('.ad-form__submit');
var mapAndFilterBlocks = document.querySelectorAll('.map__filters, .ad-form');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var popupPhotoTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup__photo');
var userAddressInput = adFormBlock.querySelector('#address');
var userRoomNumber = adFormBlock.querySelector('#room_number');
var userCapacity = adFormBlock.querySelector('#capacity');
var userPrice = adFormBlock.querySelector('#price');
var userOfferType = adFormBlock.querySelector('#type');
var userTimeIn = adFormBlock.querySelector('#timein');
var userTimeOut = adFormBlock.querySelector('#timeout');
var mapCardBlock = null;
