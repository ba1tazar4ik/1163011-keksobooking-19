// eslint-disable-next-line strict
var KEY_ENTER = 'Enter';
var USER_PIN_BLOCK = document.querySelector('.map__pin--main');
var MAP_PINS_BLOCK = document.querySelector('.map__pins');
var MAP_BLOCK = document.querySelector('.map');
var AD_FORM_BLOCK = document.querySelector('.ad-form');
var MAP_AND_FILTER_BLOCKS = document.querySelectorAll('.map__filters, .ad-form');
var USER_ADDRESS_INPUT = document.querySelector('#address');
var USER_ROOM_NUMBER = document.querySelector('#room_number');
var USER_CAPACITY = document.querySelector('#capacity');
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
// var OFFER_TYPE = {flat: 'Квартира', palace: 'Дворец', house: 'Дом', bungalo: 'Бунгало'};
var advertisements = [];

USER_ROOM_NUMBER.addEventListener('change', function () {
  if (USER_CAPACITY.value > USER_ROOM_NUMBER.value) {
    USER_CAPACITY.setCustomValidity('Passwords must match');
  }else {
    USER_CAPACITY.setCustomValidity('');
  }
});

USER_CAPACITY.addEventListener('change', function () {
  if (USER_CAPACITY.value > USER_ROOM_NUMBER.value) {
    USER_CAPACITY.setCustomValidity('Passwords must match');
  } else {
    USER_CAPACITY.setCustomValidity('');
  }
});
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

function generateAdvertisements(advertisementsQuantity) { // создаем массив обявлений
  for (var i = 0; i < advertisementsQuantity; i++) {
    var locationX = getRandomInteger(0, MAP_PINS_BLOCK.offsetWidth);
    var locationY = getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);

    advertisements[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
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

  return advertisements;
}

var renderPin = function (ad) { // рисуем шаблон метки на карте
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var mapPin = mapPinTemplate.cloneNode(true);
  var mapPinImg = mapPin.querySelector('img');

  mapPin.style.cssText = 'left: ' + (ad.location.x - mapPinTemplate.offsetWidth / 2) + 'px; top: ' + (ad.location.y - mapPinTemplate.offsetHeight) + 'px;';
  mapPinImg.src = ad.author.avatar;
  mapPinImg.alt = ad.offer.title;

  return mapPin;
};

function generateAdvertisementPins(advertisementsQuantity) { // создаем метки для обявлений
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisementsQuantity; i++) {
    fragment.appendChild(renderPin(advertisements[i]));
  }

  MAP_PINS_BLOCK.appendChild(fragment);
}

// function renderCardFeatures(adf, ad, mapCardBlock) { // проверяем какие Features у нас есть в объявлении и есть ли они вообще
//   if (ad.length > 0) {
//     for (var i = 0; i < adf.length; i++) {
//       if (!ad.includes(adf[i])) {
//         mapCardBlock.querySelector('.popup__feature--' + adf[i]).classList.add('hidden');
//       }
//     }
//   } else {
//     mapCardBlock.classList.add('hidden');
//   }
// }
//
// function renderCardPhotos(ad, mapCardBlock) { // проверяем какие Photo у нас есть в объявлении и есть ли они вообще
//   if (ad.length > 0) {
//     var fragment = document.createDocumentFragment();
//     var popupPhotoTemplate = document.querySelector('#card')
//       .content
//       .querySelector('.popup__photo');
//     mapCardBlock.innerHTML = '';
//     for (var i = 0; i < ad.length; i++) {
//       var popupPhoto = popupPhotoTemplate.cloneNode(true);
//       popupPhoto.src = ad[i];
//       fragment.appendChild(popupPhoto);
//     }
//     mapCardBlock.appendChild(fragment);
//   } else {
//     mapCardBlock.classList.add('hidden');
//   }
// }

// function renderCard(ad) { // получаем карточку объявления
//   var mapCardTemplate = document.querySelector('#card')
//     .content
//     .querySelector('.map__card');
//   var mapCard = mapCardTemplate.cloneNode(true);
//
//   mapCard.querySelector('.popup__avatar').src = ad.author.avatar;
//   mapCard.querySelector('.popup__title').textContent = ad.offer.title;
//   mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
//   mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
//   mapCard.querySelector('.popup__type').textContent = OFFER_TYPE[ad.offer.type];
//   mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
//   mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
//   renderCardFeatures(ADVERTISEMENT_FEATURES, ad.offer.features, mapCard.querySelector('.popup__features'));
//   mapCard.querySelector('.popup__description').textContent = ad.offer.description;
//   renderCardPhotos(ad.offer.photos, mapCard.querySelector('.popup__photos'));
//   return mapCard;
// }


function getAdvertisements(advertisementsQuantity) { // получаем объявления и метки на карте
  generateAdvertisements(advertisementsQuantity);
  generateAdvertisementPins(advertisementsQuantity);
}

function getUserAdvertisementAddress() { // функция записывает значение поля #address объявления пользовтеля
  USER_ADDRESS_INPUT.value = Math.floor(USER_PIN_BLOCK.offsetTop + USER_PIN_BLOCK.offsetHeight) + ' , ' + Math.floor(USER_PIN_BLOCK.offsetLeft + USER_PIN_BLOCK.offsetWidth / 2);
  console.log('я работаю');
}

function switchesForm(booleanTrigger) { // функция переключает состояние форм
  MAP_BLOCK.classList.toggle('map--faded', booleanTrigger);
  AD_FORM_BLOCK.classList.toggle('ad-form--disabled', booleanTrigger);
  MAP_AND_FILTER_BLOCKS.forEach(function (current) {
    current.querySelectorAll('select, input, textarea').forEach(function (currentValue) {
      currentValue.disabled = booleanTrigger;
    });
  });
  USER_ADDRESS_INPUT.readOnly = true;
}

function userPinMouseDownHandler() { // функция вешает обработчик движения метки и обработчик отпускания метки после нажатия на метку пользователя
  MAP_PINS_BLOCK.addEventListener('mousemove', mapPinMouseMoveHandler);
  document.addEventListener('mouseup', userPinMouseUpHandler);
}

function mapPinMouseMoveHandler() { // функция заполняет инпут с адресом координатами острой части метки
  getUserAdvertisementAddress();
}

function userPinMouseUpHandler() { // функция в момент отпускания метки убирает обработчик движения метки и обработчик отпускания метки, включает обработчик нажатия на метку
  MAP_PINS_BLOCK.removeEventListener('mousemove', mapPinMouseMoveHandler);
  document.removeEventListener('mouseup', userPinMouseUpHandler);
  USER_PIN_BLOCK.addEventListener('mousedown', userPinMouseDownHandler);
}

function disableForms() { // функция выключает карту и формы
  USER_PIN_BLOCK.addEventListener('mousedown', userPinFirstMouseDownHandler);
  USER_PIN_BLOCK.addEventListener('mousedown', userPinMouseDownHandler);
  USER_PIN_BLOCK.addEventListener('keydown', userPinFirstMouseDownHandler);

  getUserAdvertisementAddress();
  switchesForm(true);
}

function userPinFirstMouseDownHandler(evt) { // функция переводит сайт в активное состояние после клика или нажатия Enter на метке и убирает обработчик клика и нажатия Enter
  if (evt.button === 0 || evt.key === KEY_ENTER) {
    USER_PIN_BLOCK.removeEventListener('mousedown', userPinFirstMouseDownHandler);
    USER_PIN_BLOCK.removeEventListener('keydown', userPinFirstMouseDownHandler);

    switchesForm(false);
    getAdvertisements(8);
  }
}

// запускаем включение неактивного состояния сайта после его загрузки
disableForms();


// MAP_BLOCK.insertBefore(renderCard(advertisements[0]), document.querySelector('.map__filters-container'));
