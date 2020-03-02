// eslint-disable-next-line strict
(function () {
  function openPopupMapCard(ad) {
    if (mapCardBlock) {
      removeMapCardBlock();
    }
    mapBlock.insertBefore(renderCard(ad), mapFiltersBlock);
    mapCardBlock = mapBlock.querySelector('.map__card');
    mapBlock.querySelector('.popup__close').addEventListener('click', removeMapCardBlock);
    document.addEventListener('keydown', closePopupMapCard);
    return mapCardBlock;
  }

  function closePopupMapCard(evt) {
    if (evt.key === KEYCODE_ESCAPE) {
      removeMapCardBlock();
    }
  }

  function removeMapCardBlock() {
    mapBlock.removeChild(mapCardBlock);
    mapCardBlock = null;
    document.removeEventListener('keydown', closePopupMapCard);
  }



  function renderCardFeatures(adFeatures, ad, cardFeaturesBlock) { // проверяем какие Features у нас есть в объявлении и есть ли они вообще
    if (ad.length > 0) {
      for (var i = 0; i < adFeatures.length; i++) {
        if (!ad.includes(adFeatures[i])) {
          cardFeaturesBlock.querySelector('.popup__feature--' + adFeatures[i]).classList.add('hidden');
        }
      }
    } else {
      cardFeaturesBlock.classList.add('hidden');
    }
  }

  function renderCardPhotos(adPhoto, cardPhotosBlock) { // проверяем какие Photo у нас есть в объявлении и есть ли они вообще
    if (adPhoto.length > 0) {
      var fragment = document.createDocumentFragment();
      cardPhotosBlock.innerHTML = '';
      for (var i = 0; i < adPhoto.length; i++) {
        var popupPhoto = popupPhotoTemplate.cloneNode(true);
        popupPhoto.src = adPhoto[i];
        fragment.appendChild(popupPhoto);
      }
    } else {
      cardPhotosBlock.classList.add('hidden');
      fragment = popupPhotoTemplate;
    }
    return fragment;
  }

  function renderCard(ad) { // получаем карточку объявления
    var mapCard = mapCardTemplate.cloneNode(true);

    mapCard.querySelector('.popup__avatar').src = ad.author.avatar;
    mapCard.querySelector('.popup__title').textContent = ad.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    mapCard.querySelector('.popup__type').textContent = OFFER_TYPE[ad.offer.type];
    mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    renderCardFeatures(ADVERTISEMENT_FEATURES, ad.offer.features, mapCard.querySelector('.popup__features'));
    mapCard.querySelector('.popup__description').textContent = ad.offer.description;
    mapCard.querySelector('.popup__photos').appendChild(renderCardPhotos(ad.offer.photos, mapCard.querySelector('.popup__photos')));

    return mapCard;
  }
})();
