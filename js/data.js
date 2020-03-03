'use strict';
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
  var advertisements = [];
  var mapBlock = document.querySelector('.map');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');


  function generateAdvertisement(index) { // создаем объект обьявления
    var locationX = window.utils.getRandomInteger(0, mapPinsBlock.offsetWidth);
    var locationY = window.utils.getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);

    return {
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png',
      },
      offer: {
        title: window.utils.getArrayRandomElement(ADVERTISEMENT_TITLES),
        address: locationX + ',' + locationY,
        price: window.utils.getRandomInteger(1, MAX_PRICE_MULTIPLIER) * PRICE_MULTIPLIER,
        type: window.utils.getArrayRandomElement(ADVERTISEMENT_TYPES),
        rooms: window.utils.getRandomInteger(1, MAX_ROOMS),
        guests: window.utils.getRandomInteger(0, MAX_GUESTS),
        checkin: window.utils.getArrayRandomElement(ADVERTISEMENT_CHECKS),
        checkout: window.utils.getArrayRandomElement(ADVERTISEMENT_CHECKS),
        features: window.utils.getArrayRandomLength(ADVERTISEMENT_FEATURES),
        description: window.utils.getArrayRandomLength(ADVERTISING_DESCRIPTIONS).join('. '),
        photos: window.utils.getArrayRandomLength(ADVERTISEMENT_PHOTOS),
      },
      location: {
        x: locationX,
        y: locationY,
      },
    };
  }

  function generateAdvertisements(advertisementsQuantity) { // создаем массив обявлений
    for (var i = 0; i < advertisementsQuantity; i++) {
      advertisements[i] = generateAdvertisement(i);
    }

    return advertisements;
  }
  window.data = {
    generate: generateAdvertisements,
    ADVERTISEMENT_FEATURES: ADVERTISEMENT_FEATURES,
    advertisements: advertisements,
    mapBlock: mapBlock,
    mapPinsBlock: mapPinsBlock
  };
})();
