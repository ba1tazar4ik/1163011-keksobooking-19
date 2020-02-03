// eslint-disable-next-line strict
var ADVERTISING_TITLES = ['Прекрасная лочуга для романтиков', 'Квартира с отличным видом', 'Шикарные аппартоменты', 'Велликолепный дом для утонченных натур', 'Команта для комфортного ночлега', 'Комната в спокойном общежитии', 'Уютное гнездышко для молодоженов'];
var ADVERTISING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ADVERTISING_CHECKS = ['12:00', '13:00', '14:00'];
var ADVERTISING_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADVERTISING_DESCRIPTIONS = ['Подходит как туристам, так и бизнесменам', 'Жилье полностью укомплектовано и недавно отремонтировано', 'Есть вся необходимая бытовая техника', 'Есть посуда и кухонные принадлежности', 'Удобное рассположение в центре Токио', 'Понорамный вид из окон'];
var ADVERTISING_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var MAX_PRICE_MULTIPLIER = 100;
var PRICE_MULTIPLIER = 100;
var MAX_ROOMS = 100;
var MAX_GUESTS = 3;
var mapPinsBlock = document.querySelector('.map__pins');
var advertisings = [];

// удаляем класс на блоке с картой(временное решение)
document.querySelector('.map').classList.remove('map--faded');

// вспомогателбьные функции
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

// основные функции
function generateAdvertisings(advertisingsQuantity) { // создаем массив обявлений
  for (var i = 0; i < advertisingsQuantity; i++) {
    var locationX = getRandomInteger(0, mapPinsBlock.offsetWidth);
    var locationY = getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);

    advertisings[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getArrayRandomElement(ADVERTISING_TITLES),
        address: locationX + ',' + locationY,
        price: getRandomInteger(1, MAX_PRICE_MULTIPLIER) * PRICE_MULTIPLIER,
        type: getArrayRandomElement(ADVERTISING_TYPES),
        rooms: getRandomInteger(1, MAX_ROOMS),
        guests: getRandomInteger(0, MAX_GUESTS),
        checkin: getArrayRandomElement(ADVERTISING_CHECKS),
        checkout: getArrayRandomElement(ADVERTISING_CHECKS),
        features: getArrayRandomLength(ADVERTISING_FEATURES),
        description: getArrayRandomLength(ADVERTISING_DESCRIPTIONS).join('. '),
        photos: getArrayRandomLength(ADVERTISING_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  return advertisings;
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

function generateAdvertisingPins(advertisingsQuantity) { // создаем метки для обявлений
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisingsQuantity; i++) {
    fragment.appendChild(renderPin(advertisings[i]));
  }

  mapPinsBlock.appendChild(fragment);
}

function getAdvertisings(advertisingsQuantity) { // получаем объявления и метки на карте
  generateAdvertisings(advertisingsQuantity);
  generateAdvertisingPins(advertisingsQuantity);
}

getAdvertisings(8);
