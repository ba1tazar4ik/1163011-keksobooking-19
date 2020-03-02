// eslint-disable-next-line strict
(function () {
  var renderPin = function (ad) { // рисуем шаблон метки на карте
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImg = mapPin.querySelector('img');

    mapPin.style.cssText = 'left: ' + (ad.location.x - mapPinTemplate.offsetWidth / 2) + 'px; top: ' + (ad.location.y - mapPinTemplate.offsetHeight) + 'px;';
    mapPinImg.src = ad.author.avatar;
    mapPinImg.alt = ad.offer.title;
    mapPin.addEventListener('click', function () {
      openPopupMapCard(ad);
    });
    return mapPin;
  };

  function generateAdvertisementPins(advertisementsQuantity) { // создаем метки для обявлений
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertisementsQuantity; i++) {
      fragment.appendChild(renderPin(advertisements[i]));
    }

    mapPinsBlock.appendChild(fragment);
  }
})();
