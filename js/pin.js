'use strict';
(function () {
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  function renderPin(ad) { // рисуем шаблон метки на карте
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImg = mapPin.querySelector('img');

    mapPin.style.cssText = 'left: ' + (ad.location.x - mapPinTemplate.offsetWidth / 2) + 'px; top: ' + (ad.location.y - mapPinTemplate.offsetHeight) + 'px;';
    mapPinImg.src = ad.author.avatar;
    mapPinImg.alt = ad.offer.title;
    mapPin.addEventListener('click', function () {
      window.card.open(ad);
    });
    return mapPin;
  }

  window.pin = {
    render: renderPin
  };
})();
