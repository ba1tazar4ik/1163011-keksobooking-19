// eslint-disable-next-line strict
(function () {
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
})();
