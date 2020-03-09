'use strict';
(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  function renderPin(ad) { // рисуем шаблон метки на карте
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImg = mapPin.querySelector('img');

    mapPin.style.cssText = 'left: ' + (ad.location.x - MAP_PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - MAP_PIN_HEIGHT) + 'px;';
    mapPinImg.src = ad.author.avatar;
    mapPinImg.alt = ad.offer.title;
    mapPin.addEventListener('click', function () {
      window.card.open(ad);
      mapPin.classList.add('map__pin--active');
    });
    return mapPin;
  }

  window.pin = {
    render: renderPin
  };
})();
