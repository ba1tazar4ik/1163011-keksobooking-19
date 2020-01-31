// eslint-disable-next-line strict
var mapPin = document.querySelector('#pin');
var mapPinsBlock = document.querySelector('.map__pins');
var advertisings = [];
var advertisingTitles = ['Прекрасная лочуга для романтиков', 'Квартира с отличным видом', 'Шикарные аппартоменты', 'Велликолепный дом для утонченных натур', 'Команта для комфортного ночлега', 'Комната в спокойном общежитии', 'Уютное гнездышко для молодоженов'];
var advertisingTypes = ['palace', 'flat', 'house', 'bungalo'];
var advertisingChecks = ['12:00', '13:00', '14:00'];
var advertisingFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var advertisingDescriptions = ['Подходит как туристам, так и бизнесменам.', 'Жилье полностью укомплектовано и недавно отремонтировано.', 'Есть вся необходимая бытовая техника.', 'Есть посуда и кухонные принадлежности.', 'Удобное рассположение в центре Токио', 'Понорамный вид из окон'];
var advertisingPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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
  var arrayRandomLength = [];
  var shuffleArray = shuffle(anyArray);
  for (var i = 0; i <= getRandomInteger(0, anyArray.length); i++) {
    arrayRandomLength[i] = (shuffleArray[i]);
  }
  return arrayRandomLength;
}

// основные функции
function generateAdvertisings(advertisingsQuantity) { // создаем массив обявлений
  for (var i = 0; i < advertisingsQuantity; i++) {
    var locationX = getRandomInteger(0, mapPinsBlock.offsetWidth);
    var locationY = getRandomInteger(130, 630);
    advertisings[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getArrayRandomElement(advertisingTitles),
        address: locationX + ',' + locationY,
        price: getRandomInteger(1, 100) * 100,
        type: getArrayRandomElement(advertisingTypes),
        rooms: getRandomInteger(1, 100),
        guests: getRandomInteger(0, 3),
        checkin: getArrayRandomElement(advertisingChecks),
        checkout: getArrayRandomElement(advertisingChecks),
        features: getArrayRandomLength(advertisingFeatures),
        description: getArrayRandomLength(advertisingDescriptions),
        photos: getArrayRandomLength(advertisingPhotos)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
}

function generateAdvertisingPins(advertisingsQuantity) { // создаем пины для обявлений
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisingsQuantity; i++) {
    var newElement = document.createElement('button');
    newElement.className = 'map__pin';
    newElement.style.cssText = 'left: ' + (advertisings[i].location.x + mapPin.offsetWidth / 2) + 'px; top: ' + (advertisings[i].location.y + mapPin.offsetHeight) + 'px;';
    newElement.innerHTML = '<img src="' + advertisings[i].author.avatar + '" width="40" height="40" draggable="false" alt="' + advertisings[i].offer.title + '">';
    fragment.appendChild(newElement);
  }
  mapPinsBlock.appendChild(fragment);
}

function getAdvertisings(advertisingsQuantity) { // получаем объявления и метки на карте
  generateAdvertisings(advertisingsQuantity);
  generateAdvertisingPins(advertisingsQuantity);
}

getAdvertisings(8);
