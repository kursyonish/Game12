let player = 0;
let dice1 = 0;
let dice2 = 0;
let numPlayers = 2;
let cards = [];
let waitingForChoice = false;

document.querySelector("#go").addEventListener("click", handlGo);
document.querySelector("#newGame").addEventListener("click", startNewGame);
document.querySelector("#numPlayers").addEventListener("change", startNewGame);

startNewGame();

function startNewGame() {
    numPlayers = parseInt(document.querySelector("#numPlayers").value, 10);
    if (isNaN(numPlayers) || numPlayers < 2) {
        numPlayers = 2;
        document.querySelector("#numPlayers").value = "2";
    }
    if (numPlayers > 8) {
        numPlayers = 8;
        document.querySelector("#numPlayers").value = "8";
    }
    cards = [];
    for (let p = 0; p < numPlayers; p++) {
        cards.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
    player = 0;
    waitingForChoice = false;
    dice1 = 0;
    dice2 = 0;
    document.querySelector("#go").disabled = false;
    document.querySelector("#Dice").innerHTML =
        `<p class="dice-prompt">Игрок ${player + 1} — press <strong>Бросок</strong></p>`;
    showCards(document.querySelector("#GameField"));
}

function handlGo() {
    if (waitingForChoice) {
        return;
    }
    dice1 = randFromTo(1, 6);
    dice2 = randFromTo(1, 6);
    waitingForChoice = true;
    document.querySelector("#go").disabled = true;
    showDice(document.querySelector("#Dice"));
}

function randFromTo(n, N) {
    return Math.floor(n + Math.random() * (N - n + 1));
}

function showDice(to) {
    let sum = dice1 + dice2;
    let str = `<p class="dice-readout"><span class="dice-who">Игрок ${player + 1}</span> · `;
    str += `<span class="dice-pip">${dice1}</span> and <span class="dice-pip">${dice2}</span></p><div class="dice-actions">`;
    str += `<button type="button" class="dice-pick" data-pick="both">Оба числа ${dice1} и ${dice2}</button>`;
    str += `<button type="button" class="dice-pick" data-pick="sum">Сумма ${sum}</button>`;
    if (dice1 === dice2) {
        str += `<button type="button" class="dice-pick" data-pick="one">Только ${dice1}</button>`;
    } else {
        str += `<button type="button" class="dice-pick" data-pick="first">Только ${dice1}</button>`;
        str += `<button type="button" class="dice-pick" data-pick="second">Только ${dice2}</button>`;
    }
    str += `<button type="button" class="dice-pick" data-pick="skip">Пропуск</button></div>`;
    to.innerHTML = str;
    to.querySelectorAll(".dice-pick").forEach(function (btn) {
        btn.addEventListener("click", function () {
            pickChoice(btn.getAttribute("data-pick"));
        });
    });
}

function setDiceButtonsDisabled(disabled) {
    document.querySelectorAll(".dice-pick").forEach(function (btn) {
        btn.disabled = disabled;
    });
}

function pickChoice(choice) {
    if (!waitingForChoice) {
        return;
    }
    if (choice === "one") {
        choice = "first";
    }
    setDiceButtonsDisabled(true);

    if (choice !== "skip" && !canRemoveForChoice(cards[player], choice, dice1, dice2)) {
        alert("У вас нет этого числа");
        setDiceButtonsDisabled(false);
        return;
    }
    if (choice !== "skip") {
        applyRemovalForChoice(choice, dice1, dice2);
    }

    waitingForChoice = false;
    document.querySelector("#go").disabled = false;

    if (cards[player].length === 0) {
        document.querySelector("#Dice").innerHTML =
            `<p class="dice-prompt dice-win">Игрок ${player + 1} wins</p>`;
        showCards(document.querySelector("#GameField"));
        document.querySelector("#go").disabled = true;
        return;
    }

    player = (player + 1) % numPlayers;
    document.querySelector("#Dice").innerHTML =
        `<p class="dice-prompt">Игрок ${player + 1} — press <strong>Бросок</strong></p>`;
    showCards(document.querySelector("#GameField"));
}

function canRemoveForChoice(hand, choice, d1, d2) {
    if (choice === "both") {
        if (d1 === d2) {
            return hand.filter(function (el) { return el === d1; }).length >= 2;
        }
        return hand.indexOf(d1) !== -1 && hand.indexOf(d2) !== -1;
    }
    if (choice === "sum") {
        return hand.indexOf(d1 + d2) !== -1;
    }
    if (choice === "first" || choice === "second") {
        let v = choice === "first" ? d1 : d2;
        return hand.indexOf(v) !== -1;
    }
    return false;
}

function applyRemovalForChoice(choice, d1, d2) {
    if (choice === "both") {
        let hand = cards[player];
        if (d1 === d2) {
            let removed = 0;
            cards[player] = hand.filter(function (el) {
                if (el === d1 && removed < 2) {
                    removed = removed + 1;
                    return false;
                }
                return true;
            });
        } else {
            let took1 = false;
            let took2 = false;
            cards[player] = hand.filter(function (el) {
                if (!took1 && el === d1) {
                    took1 = true;
                    return false;
                }
                if (!took2 && el === d2) {
                    took2 = true;
                    return false;
                }
                return true;
            });
        }
        return;
    }
    if (choice === "sum") {
        let sum = d1 + d2;
        let took = false;
        cards[player] = cards[player].filter(function (el) {
            if (!took && el === sum) {
                took = true;
                return false;
            }
            return true;
        });
        return;
    }
    if (choice === "first" || choice === "second") {
        let v = choice === "first" ? d1 : d2;
        let took = false;
        cards[player] = cards[player].filter(function (el) {
            if (!took && el === v) {
                took = true;
                return false;
            }
            return true;
        });
    }
}

function showCards(to) {
    to.innerHTML = "";
    for (let p = 0; p < numPlayers; p++) {
        let nums = cards[p]
            .map(function (el) {
                return String(el);
            })
            .join(", ");
        to.innerHTML += `<div class="player-line"><span class="player-label">И${p + 1}</span>`;
        to.innerHTML += `<span class="player-cards">${nums}</span></div>`;
    }
}
