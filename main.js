let player = 0;
let dice1 = 0;
let dice2 = 0;
let cardPlayer1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let cardPlayer2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

document.querySelector("#go").addEventListener("click", handlGo);
showCards(document.querySelector("#GameField"));

function handlGo() {
  player = (player + 1) % 2;
  dice1 = randFromTo(1, 6);
  dice2 = randFromTo(1, 6);
  showDice(document.querySelector("#Dice"));
}

function randFromTo(n, N) {
  return Math.floor(n + Math.random() * (N - n + 1));
}

function showDice(to) {
  let str = "Turn player " + (player + 1) + ":  " + dice1 + " " + dice2;

  let currentPlayerCards = player === 0 ? cardPlayer1 : cardPlayer2;

  if (
    currentPlayerCards.includes(dice1) &&
    currentPlayerCards.includes(dice2)
  ) {
    str += ` <input type="button" value=" ${dice1} and ${dice2}" onclick="removeTwoNumbers(${dice1}, ${dice2})" />`;
  }

  let sum = dice1 + dice2;
  if (currentPlayerCards.includes(sum)) {
    str += `<input type="button" value=" ${sum}" onclick="removeNumber(${sum})" />`;
  }

  to.innerHTML = str;
}


function showCards(to) {
       
    to.innerHTML += "Player1 ";
    cardPlayer1.forEach((el, i, _) => to.innerHTML += el + ",");
    to.innerHTML += "<br>";
    
    to.innerHTML += "Player2 ";
    cardPlayer2.forEach((el, i, _) => to.innerHTML += el + ",");
    
    if (cardPlayer1.length === 0) {
        to.innerHTML += "<br><strong>Player 1 wins!</strong>";
    } else if (cardPlayer2.length === 0) {
        to.innerHTML += "<br><strong>Player 2 wins!</strong>";
    }
}

function removeNumber(n) {
  if (player === 0) {
    cardPlayer1 = cardPlayer1.filter((el) => el !== n);
  } else {
    cardPlayer2 = cardPlayer2.filter((el) => el !== n);
  }
  let gameField = document.querySelector("#GameField");
  gameField.innerHTML = ""; 
  showCards(gameField); 
  showDice(document.querySelector("#Dice"));
}

function removeTwoNumbers(n1, n2) {
  if (player === 0) {
    if (n1 === n2) {
      let count = 0;
      cardPlayer1 = cardPlayer1.filter((el) => {
        if (el === n1 && count < 2) {
          count++;
          return false;
        }
        return true;
      });
    } else {
      cardPlayer1 = cardPlayer1.filter((el) => el !== n1 && el !== n2);
    }
  } else {
    if (n1 === n2) {
      let count = 0;
      cardPlayer2 = cardPlayer2.filter((el) => {
        if (el === n1 && count < 2) {
          count++;
          return false;
        }
        return true;
      });
    } else {
      cardPlayer2 = cardPlayer2.filter((el) => el !== n1 && el !== n2);
    }
  }

  let gameField = document.querySelector("#GameField");
  gameField.innerHTML = ""; 
  showCards(gameField); 
  showDice(document.querySelector("#Dice"));
}
