// eslint-disable-next-line strict
(function () {
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
  var mapPinsBlock = window.globalVariables.mapBlock.querySelector('.map__pins');

  function generateAdvertisement(index) { // создаем объект обьявления
    var locationX = window.util.getRandomInteger(0, mapPinsBlock.offsetWidth);
    var locationY = window.util.getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);

    return {
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png',
      },
      offer: {
        title: window.util.getArrayRandomElement(ADVERTISEMENT_TITLES),
        address: locationX + ',' + locationY,
        price: window.util.getRandomInteger(1, MAX_PRICE_MULTIPLIER) * PRICE_MULTIPLIER,
        type: window.util.getArrayRandomElement(ADVERTISEMENT_TYPES),
        rooms: window.util.getRandomInteger(1, MAX_ROOMS),
        guests: window.util.getRandomInteger(0, MAX_GUESTS),
        checkin: window.util.getArrayRandomElement(ADVERTISEMENT_CHECKS),
        checkout: window.util.getArrayRandomElement(ADVERTISEMENT_CHECKS),
        features: window.util.getArrayRandomLength(ADVERTISEMENT_FEATURES),
        description: window.util.getArrayRandomLength(ADVERTISING_DESCRIPTIONS).join('. '),
        photos: window.util.getArrayRandomLength(ADVERTISEMENT_PHOTOS),
      },
      location: {
        x: locationX,
        y: locationY,
      },
    };
  }

  window.data = {
    generateAdvertisements:
      function generateAdvertisements(advertisementsQuantity) { // создаем массив обявлений
        for (var i = 0; i < advertisementsQuantity; i++) {
          window.globalVariables.advertisements[i] = generateAdvertisement(i);
        }

        return window.globalVariables.advertisements;
      },
  };
})();
