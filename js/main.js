// eslint-disable-next-line strict
var KEY_ENTER = 'Enter';
var KEYCODE_ESCAPE = 'Escape';
var ADVERTISEMENT_TITLES = ['Прекрасная лочуга для романтиков', 'Квартира с отличным видом', 'Шикарные аппартоменты', 'Велликолепный дом для утонченных натур', 'Команта для комфортного ночлега', 'Комната в спокойном общежитии', 'Уютное гнездышко для молодоженов'];
var ADVERTISEMENT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ADVERTISEMENT_CHECKS = ['12:00', '13:00', '14:00'];
var ADVERTISEMENT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADVERTISING_DESCRIPTIONS = ['Подходит как туристам, так и бизнесменам', 'Жилье полностью укомплектовано и недавно отремонтировано', 'Есть вся необходимая бытовая техника', 'Есть посуда и кухонные принадлежности', 'Удобное рассположение в центре Токио', 'Понорамный вид из окон'];
var ADVERTISEMENT_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var MAX_PRICE_MULTIPLIER = 100;
var PRICE_MULTIPLIER = 100;
var MAX_ROOMS = 100;
var MAX_GUESTS = 3;
var OFFER_TYPE = {flat: 'Квартира', palace: 'Дворец', house: 'Дом', bungalo: 'Бунгало'};
var OFFER_MIN_COST = {flat: 1000, palace: 10000, house: 5000, bungalo: 0};
var QUANTITY = 8;
var advertisements = [];
var mapBlock = document.querySelector('.map');
var userPinBlock = mapBlock.querySelector('.map__pin--main');
var mapPinsBlock = mapBlock.querySelector('.map__pins');
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
