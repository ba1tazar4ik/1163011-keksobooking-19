// eslint-disable-next-line strict
var mapBlock = document.querySelector('.map');
var mapBlockWidth = mapBlock.offsetWidth;
var ads = [];
var ad = {};
var adTitles = ['Прекрасная лочуга для романтиков', 'Квартира с отличным видом', 'Шикарные аппартоменты', 'Велликолепный дом для утонченных натур', 'Команта для комфортного ночлега', 'Комната в спокойном общежитии', 'Уютное гнездышко для молодоженов']

// удаляем класс на блоке с картой(временное решение)
mapBlock.classList.remove('map--faded');

// вычесляем случайное целое число
function randomInteger(min, max) {
  // случайное число от min до (max+1)
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
}

function generateAds(adsQuantity) {
  for (var i = 0; i < adsQuantity; i++) {
    var locationX = randomInteger(130, mapBlockWidth);
    var locationY = randomInteger(130, 630);
    ads[i] = ad = {
      author: {
        avatar: 'img/avatars/user0' + (i +1) + '.png'
      },
      offer: {
        title: adTitles[Math.floor(Math.random() * adTitles.length)],
        address: locationX + ',' + locationY
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
}

generateAds(2);

console.log(ads[0]);
console.log(ads[1]);
