// eslint-disable-next-line strict
(function () {


  function shuffle(array) { // перемешиваем массив
    var j;
    var temp;

    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }

    return array;
  }

  window.util = {
    getRandomInteger:
      function getRandomInteger(min, max) { // случайное целое число
        // случайное число от min до (max+1)
        var randomNumber = min + Math.random() * (max + 1 - min);
        return Math.floor(randomNumber);
      },
    getArrayRandomElement:
      function (array) { // случайный элемент масива
        var randomNumber = Math.floor(Math.random() * array.length);
        return array[randomNumber];
      },
    getArrayRandomLength:
      function (array) { // массив случайной длинны заполненный случайными данными
        var shuffleArray = shuffle(array);
        return shuffleArray.slice(0, window.util.getRandomInteger(0, shuffleArray.length));
      }
  };
})();
