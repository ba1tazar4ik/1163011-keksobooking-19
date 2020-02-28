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

// НАЧАЛО ВАЛИДАЦИИ
function validationUserCapacity() {
  userCapacity.setCustomValidity(
      userCapacity.value > userRoomNumber.value ? ('В ' + userRoomNumber.value + ' комантах могут быть размещеные не более ' + userRoomNumber.value + ' гостей') : ('')
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

function getRandomInteger(min, max) { // случайное целое число
  // случайное число от min до (max+1)
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
}

function getArrayRandomElement(array) { // случайный элемент масива
  var randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
}

function shuffle(array) { // перемешиваем массив
  var j;
  var temp;

  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
}

function getArrayRandomLength(array) { // массив случайной длинны заполненный случайными данными
  var shuffleArray = shuffle(array);
  return shuffleArray.slice(0, getRandomInteger(0, shuffleArray.length));
}

function generateAdvertisement(index) { // создаем объект обьявления
  var locationX = getRandomInteger(0, mapPinsBlock.offsetWidth);
  var locationY = getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);

  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: getArrayRandomElement(ADVERTISEMENT_TITLES),
      address: locationX + ',' + locationY,
      price: getRandomInteger(1, MAX_PRICE_MULTIPLIER) * PRICE_MULTIPLIER,
      type: getArrayRandomElement(ADVERTISEMENT_TYPES),
      rooms: getRandomInteger(1, MAX_ROOMS),
      guests: getRandomInteger(0, MAX_GUESTS),
      checkin: getArrayRandomElement(ADVERTISEMENT_CHECKS),
      checkout: getArrayRandomElement(ADVERTISEMENT_CHECKS),
      features: getArrayRandomLength(ADVERTISEMENT_FEATURES),
      description: getArrayRandomLength(ADVERTISING_DESCRIPTIONS).join('. '),
      photos: getArrayRandomLength(ADVERTISEMENT_PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

function generateAdvertisements(advertisementsQuantity) { // создаем массив обявлений
  for (var i = 0; i < advertisementsQuantity; i++) {
    advertisements[i] = generateAdvertisement(i);
  }

  return advertisements;
}

var renderPin = function (ad) { // рисуем шаблон метки на карте
  var mapPin = mapPinTemplate.cloneNode(true);
  var mapPinImg = mapPin.querySelector('img');

  mapPin.style.cssText = 'left: ' + (ad.location.x - mapPinTemplate.offsetWidth / 2) + 'px; top: ' + (ad.location.y - mapPinTemplate.offsetHeight) + 'px;';
  mapPinImg.src = ad.author.avatar;
  mapPinImg.alt = ad.offer.title;
  mapPin.addEventListener('click', mapPinClickHandler);
  return mapPin;
};
function mapPinClickHandler() {
  addMapCardBlock();
}

function addMapCardBlock(ad) {
  if (mapCardBlock) {
    removeMapCardBlock();
  }
  mapBlock.insertBefore(renderCard(ad), mapFiltersBlock);
  mapCardBlock = mapBlock.querySelector('.map__card');
  mapBlock.querySelector('.popup__close').addEventListener('click', removeMapCardBlock);
  document.addEventListener('keydown', closePopupPhoto);
  return mapCardBlock;
}

function closePopupPhoto(evt) {
  if (evt.key === KEYCODE_ESCAPE) {
    removeMapCardBlock();
    document.removeEventListener('keydown', closePopupPhoto);
  }
}

function removeMapCardBlock() {
  mapBlock.removeChild(mapCardBlock);
  mapCardBlock = null;
}

function generateAdvertisementPins(advertisementsQuantity) { // создаем метки для обявлений
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisementsQuantity; i++) {
    fragment.appendChild(renderPin(advertisements[i]));
  }

  mapPinsBlock.appendChild(fragment);
}

function renderCardFeatures(adFeatures, ad, cardFeaturesBlock) { // проверяем какие Features у нас есть в объявлении и есть ли они вообще
  if (ad.length > 0) {
    for (var i = 0; i < adFeatures.length; i++) {
      if (!ad.includes(adFeatures[i])) {
        cardFeaturesBlock.querySelector('.popup__feature--' + adFeatures[i]).classList.add('hidden');
      }
    }
  } else {
    cardFeaturesBlock.classList.add('hidden');
  }
}

function renderCardPhotos(adPhoto, cardPhotosBlock) { // проверяем какие Photo у нас есть в объявлении и есть ли они вообще
  if (adPhoto.length > 0) {
    var fragment = document.createDocumentFragment();
    cardPhotosBlock.innerHTML = '';
    for (var i = 0; i < adPhoto.length; i++) {
      var popupPhoto = popupPhotoTemplate.cloneNode(true);
      popupPhoto.src = adPhoto[i];
      fragment.appendChild(popupPhoto);
    }
  } else {
    cardPhotosBlock.classList.add('hidden');
    fragment = popupPhotoTemplate;
  }
  return fragment;
}

function renderCard(ad) { // получаем карточку объявления
  var mapCard = mapCardTemplate.cloneNode(true);

  mapCard.querySelector('.popup__avatar').src = ad.author.avatar;
  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
  mapCard.querySelector('.popup__type').textContent = OFFER_TYPE[ad.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  renderCardFeatures(ADVERTISEMENT_FEATURES, ad.offer.features, mapCard.querySelector('.popup__features'));
  mapCard.querySelector('.popup__description').textContent = ad.offer.description;
  mapCard.querySelector('.popup__photos').appendChild(renderCardPhotos(ad.offer.photos, mapCard.querySelector('.popup__photos')));

  return mapCard;
}


function getAdvertisements(advertisementsQuantity) { // получаем объявления и метки на карте
  generateAdvertisements(advertisementsQuantity);
  generateAdvertisementPins(advertisementsQuantity);
}

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

function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
  mapPinsBlock.addEventListener('mousemove', mapPinMouseMoveHandler);
  document.addEventListener('mouseup', userPinMouseUpHandler);
}

function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
  getUserAdvertisementAddress();
}

function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
  mapPinsBlock.removeEventListener('mousemove', mapPinMouseMoveHandler);
  document.removeEventListener('mouseup', userPinMouseUpHandler);
  userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
}

function disableForms() { // функция выключает карту и формы
  userPinBlock.addEventListener('mousedown', userPinFirstMouseDownHandler);
  userPinBlock.addEventListener('mousedown', userPinMouseDownHandler);
  userPinBlock.addEventListener('keydown', userPinFirstKeyDownHandler);

  getUserAdvertisementAddress();
  toggleForm(true);
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
}

function userPinFirstMouseDownHandler(evt) { // функция запускает активацию сайта после клика на метке и убирает обработчик клика и нажатия Enter
  if (evt.button === 0) {
    activateForm();
  }
}

function userPinFirstKeyDownHandler(evt) { // функция запускает активацию сайта после нажатия Enter на метке и убирает обработчик клика и нажатия Enter
  if (evt.key === KEY_ENTER) {
    activateForm();
  }
}

// запускаем включение неактивного состояния сайта после его загрузки
disableForms();
