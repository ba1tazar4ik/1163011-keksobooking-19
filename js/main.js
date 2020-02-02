// eslint-disable-next-line strict
var ADVERTISING_TITLES = ['Прекрасная лочуга для романтиков', 'Квартира с отличным видом', 'Шикарные аппартоменты', 'Велликолепный дом для утонченных натур', 'Команта для комфортного ночлега', 'Комната в спокойном общежитии', 'Уютное гнездышко для молодоженов'];
var ADVERTISING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ADVERTISING_CHECKS = ['12:00', '13:00', '14:00'];
var ADVERTISING_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADVERTISING_DESCRIPTIONS = ['Подходит как туристам, так и бизнесменам.', 'Жилье полностью укомплектовано и недавно отремонтировано.', 'Есть вся необходимая бытовая техника.', 'Есть посуда и кухонные принадлежности.', 'Удобное рассположение в центре Токио', 'Понорамный вид из окон'];
var ADVERTISING_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var minLocationY = 130;
var maxLocationY = 630;
var maxPriceMultiplier = 100;
var priceMultiplier = 100;
var maxRooms = 100;
var maxGuests = 3;
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

function getArrayRandomElement(anyArray) { // случайный элемент масива
  var randomNumber = Math.floor(Math.random() * anyArray.length);
  return anyArray[randomNumber];
}

function shuffle(anyArray) { // перемешиваем массив
  var j;
  var temp;
  for (var i = anyArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = anyArray[j];
    anyArray[j] = anyArray[i];
    anyArray[i] = temp;
  }
  return anyArray;
}

function getArrayRandomLength(anyArray) { // массив случайной длинны заполненный случайными данными
  var shuffleArray = shuffle(anyArray);
  return shuffleArray.slice(0, getRandomInteger(0, shuffleArray.length));
}

// основные функции
function generateAdvertisings(advertisingsQuantity) { // создаем массив обявлений
  for (var i = 0; i < advertisingsQuantity; i++) {
    var locationX = getRandomInteger(0, mapPinsBlock.offsetWidth);
    var locationY = getRandomInteger(minLocationY, maxLocationY);
    advertisings[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getArrayRandomElement(ADVERTISING_TITLES),
        address: locationX + ',' + locationY,
        price: getRandomInteger(1, maxPriceMultiplier) * priceMultiplier,
        type: getArrayRandomElement(ADVERTISING_TYPES),
        rooms: getRandomInteger(1, maxRooms),
        guests: getRandomInteger(0, maxGuests),
        checkin: getArrayRandomElement(ADVERTISING_CHECKS),
        checkout: getArrayRandomElement(ADVERTISING_CHECKS),
        features: getArrayRandomLength(ADVERTISING_FEATURES),
        description: getArrayRandomLength(ADVERTISING_DESCRIPTIONS),
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

function generateAdvertisingPins(advertisingsQuantity) { // создаем пины для обявлений
  var fragment = document.createDocumentFragment();
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var renderPin = function (advertisings) {
    var mapPin = mapPinTemplate.cloneNode(true);

    mapPin.style.cssText = 'left: ' + (advertisings.location.x - mapPinTemplate.offsetWidth / 2) + 'px; top: ' + (advertisings.location.y + mapPinTemplate.offsetHeight) + 'px;';
    mapPin.innerHTML = '<img src="' + advertisings.author.avatar + '" width="40" height="40" draggable="false" alt="' + advertisings.offer.title + '">';

    return mapPin;
  };
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
