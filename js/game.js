const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
var player1 = {
	name: '',
	deck: [],
	isTurn: true,
};
var player2 = {
	name: 'PC',
	deck: [],
	isTurn: false,
};
let trashStack;
let kupa_card;
let deck;

function dealCards() {
	player1.deck = [];
	player2.deck = [];
	for (let i = 0; i < 13; i++) {
		player1.deck.push(deck.pop());
	}
	for (let i = 0; i < 13; i++) {
		player2.deck.push(deck.pop());
	}
}
function createCardHTML(rank, suit) {
	return `<div data-rank="${rank}" data-suit="${suit}" onClick="cardClick(this)" class="card"><img src="./images/images/${rank}_of_${suit}.png" alt=""></div>`;
}
function renderBoard() {
	let htmlDeck1 = '';
	let htmlDeck2 = '';
	let htmlTurn = player1.name + ' playing 👆🏻';
	player1.deck.sort(compareCards);
	player2.deck.sort(compareCards);
	for (const card of player1.deck) {
		htmlDeck1 += createCardHTML(card.value, card.suit);
	}
	for (const card of player2.deck) {
		htmlDeck2 += createCardHTML(card.value, card.suit);
	}
	if (!player1.isTurn) {
		htmlTurn = player2.name + ' playing 👇🏻';
		document.querySelector('.player2').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.player1').style.backgroundColor =
			'rgb(169, 255, 255,0)';
	} else {
		document.querySelector('.player1').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.player2').style.backgroundColor =
			'rgb(169, 255, 255,0)';
	}
	if (trashStack.length === 0) {
		document.querySelector('.kupa_card').innerHTML =
			'<img  src="./images/images/back.png" alt=""> ';
	} else {
		kupa_card = trashStack[trashStack.length - 1];
		document.querySelector(
			'.kupa_card'
		).innerHTML = `<div data-rank="${kupa_card.value}" data-suit="${kupa_card.suit}" onclick="drawCardFromPile()" class="card"><img src="./images/images/${kupa_card.value}_of_${kupa_card.suit}.png" alt=""></div>`;
	}
	document.querySelector('.drawCard').innerHTML =
		'<img  src="./images/images/back.png" alt=""> ';
	document.querySelector('.turn').innerHTML = htmlTurn;
	document.querySelector('.player1').innerHTML = htmlDeck1;
	document.querySelector('.player2').innerHTML = htmlDeck2;
}
function cardClick(elcard) {
	let index = 0;
	let cardToRemove = {
		value: Number(elcard.dataset.rank),
		suit: elcard.dataset.suit,
	};
	if (player1.isTurn && player1.deck.length === 14) {
		// Find the index of the card in the deck
		index = player1.deck.findIndex(
			(i) => i.value === cardToRemove.value && i.suit === cardToRemove.suit
		);
		// Remove the card from the deck
		console.log(index);
		if (index !== -1) {
			player1.deck.splice(index, 1);
			trashStack.push(cardToRemove);
			kupa_card = trashStack[trashStack.length - 1];
			CheckWin(player1);
			player1.isTurn = false;
			player2.isTurn = true;
		}
	} else if (player2.isTurn && player2.deck.length === 14) {
		console.log('player 2');
		index = player2.deck.findIndex(
			(i) => i.value === cardToRemove.value && i.suit === cardToRemove.suit
		);
		// Remove the card from the deck
		console.log(index);
		if (index !== -1) {
			player2.deck.splice(index, 1);
			trashStack.push(cardToRemove);
			kupa_card = trashStack[trashStack.length - 1];
			CheckWin(player2);
			player1.isTurn = true;
			player2.isTurn = false;
		}
	}
	renderBoard();
}
function drawCard() {
	console.log('card draw');
	if (deck.length === 0) {
		// kupa_card=trashStack.pop();
		deck = trashStack;
		trashStack = [];
		shuffle(deck);
	}
	if (player1.isTurn && player1.deck.length === 13) {
		player1.deck.push(deck.pop());
		// renderBoard();
	} else if (player2.isTurn && player2.deck.length === 13) {
		player2.deck.push(deck.pop());
	}
	renderBoard();
}
function drawCardFromPile() {
	console.log('card draw from pile');
	if (player1.isTurn && player1.deck.length === 13) {
		player1.deck.push(kupa_card);
		drawKupa();
	} else if (player2.isTurn && player2.deck.length === 13) {
		player2.deck.push(kupa_card);
		drawKupa();
	}

	renderBoard();
}
function drawKupa() {
	if (trashStack.length === 0) {
		kupa_card = deck.pop();
	} else {
		kupa_card = trashStack.pop();
	}
	if (deck.length === 0) {
		deck = trashStack;
	}
}

function CheckWin(player) {
	let currSign = player.deck[0].suit;
	console.log(currSign);
	for (let i = 0; i < 13; i++) {
		if (currSign != player.deck[i].suit) {
			return false;
		}
	}
	console.log(player.name + ' Win');
	winGame(player);
	return true;
}
function startGame() {
	kupa_card = '';
	deck = [];
	trashStack = [];
	player1.isTurn = true;
	player2.isTurn = false;
	for (let suit of suits) {
		for (let value of ranks) {
			deck.push({ value, suit });
		}
	}
	shuffle(deck);
	kupa_card = deck.pop();
	trashStack.push(kupa_card);
	dealCards();
	player1.name = document.getElementById('name').value;
	document.querySelector('.login').style.visibility = 'hidden';
	document.querySelector('.container').style.visibility = 'visible';
	renderBoard();
}
function winGame(player) {
	document.getElementById('name').value = '';
	document.querySelector('.container').style.visibility = 'hidden';
	document.querySelector('.label').innerHTML =
		'Congrats ' + player.name + ' You win!';
	document.querySelector('.btn').innerHTML = 'Restart';
	document.querySelector('.login').style.visibility = 'visible';
}

