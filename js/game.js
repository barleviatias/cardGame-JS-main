const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ['hearts', 'diamonds', 'spades', 'clubs'];

var game = {
	player: {
		name: '',
		deck: [],
		isTurn: true,
	},
	pc: {
		name: 'PC',
		deck: [],
		collections: {
			hearts: 0,
			diamonds: 0,
			spades: 0,
			clubs: 0,
		},
		isTurn: false,
	},
	trashStack: [],
	kupa_card: 0,
	deck: [],
};

function dealCards() {
	game.player.deck = [];
	game.pc.deck = [];
	for (let i = 0; i < 13; i++) {
		game.player.deck.push(game.deck.pop());
	}
	for (let i = 0; i < 13; i++) {
		let tempcard = game.deck.pop();
		game.pc.collections[tempcard.suit]++;
		game.pc.deck.push(tempcard);
	}
}
function createCardHTML(rank, suit, isClick) {
	if (isClick)
		return `<div data-rank="${rank}" data-suit="${suit}" onClick="cardClick(this)" class="card"><img src="./images/images/${rank}_of_${suit}.png" alt=""></div>`;
	else
		return `<div data-rank="${rank}" data-suit="${suit}" class=""><img src="./images/images/back.png" alt=""></div>`;
}
function renderBoard() {
	let htmlDeck1 = '';
	let htmlDeck2 = '';
	let htmlTurn = game.player.name + ' playing 👆🏻';
	game.player.deck.sort(compareCards);
	game.pc.deck.sort(compareCards);
	for (const card of game.player.deck) {
		htmlDeck1 += createCardHTML(card.value, card.suit, true);
	}
	for (const card of game.pc.deck) {
		htmlDeck2 += createCardHTML(card.value, card.suit, false);
	}
	if (!game.player.isTurn) {
		htmlTurn = game.pc.name + ' playing 👇🏻';
		document.querySelector('.pc').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.player').style.backgroundColor =
			'rgb(169, 255, 255,0)';
	} else {
		document.querySelector('.player').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.pc').style.backgroundColor =
			'rgb(169, 255, 255,0)';
	}
	if (game.trashStack.length === 0) {
		document.querySelector('.kupa_card').innerHTML =
			'<img  src="./images/images/back.png" alt=""> ';
	} else {
		game.kupa_card = game.trashStack[game.trashStack.length - 1];
		document.querySelector(
			'.kupa_card'
		).innerHTML = `<div data-rank="${game.kupa_card.value}" data-suit="${game.kupa_card.suit}" onclick="drawCardFromPile()" class="card"><img src="./images/images/${game.kupa_card.value}_of_${game.kupa_card.suit}.png" alt=""></div>`;
	}
	document.querySelector('.drawCard').innerHTML =
		'<img  src="./images/images/back.png" alt=""> ';
	document.querySelector('.turn').innerHTML = htmlTurn;
	document.querySelector('.player').innerHTML = htmlDeck1;
	document.querySelector('.pc').innerHTML = htmlDeck2;

	console.log(game);
	saveGame(game.player.name);
}
function cardClick(elcard) {

	let index = 0;
	let cardToRemove = {
		value: Number(elcard.dataset.rank),
		suit: elcard.dataset.suit,
	};
	if (game.player.isTurn && game.player.deck.length === 14) {
		// Find the index of the card in the deck
		index = game.player.deck.findIndex(
			(i) => i.value === cardToRemove.value && i.suit === cardToRemove.suit
		);
		// Remove the card from the deck
		console.log(index);
		if (index !== -1) {
			game.player.deck.splice(index, 1);
			game.trashStack.push(cardToRemove);
			game.kupa_card = game.trashStack[game.trashStack.length - 1];
			CheckWin(game.player);
			game.player.isTurn = false;
			game.pc.isTurn = true;
			setTimeout(() => {
				// drawCardFromPile();
				// findMinCollectionSigns(game.pc);
				// renderBoard();
				pcBot();
				console.log('Delayed for 2 second.');
			}, 2000);
		}
	}
	renderBoard();

}
function removeCard(player,index) {
	if (index !== -1) {
		game.pc.deck.splice(index, 1);
		// console.log(weekCards[indexToRemove]);
		game.pc.collections[cardToRemove.suit]--;
		trashStack.push(weekCards[indexToRemove]);
		kupa_card = trashStack[trashStack.length - 1];
		CheckWin(game.pc);
		game.player.isTurn = true;
		game.pc.isTurn = false;
	}
}
function findMaxCollectionSigns(collections) {
	let maxCollection = 0;
	let maxCollectionSigns = [];
	for (const suit in collections) {
		if (collections[suit] > maxCollection) {
			maxCollection = collections[suit];
			maxCollectionSigns = [suit];
		} else if (collections[suit] === maxCollection) {
			maxCollectionSigns.push(suit);
		}
	}
	return maxCollectionSigns;
}

function findMinCollectionSigns() {
	let minCollection = 14;
	let minCollectionSigns = [];
	let weekCards = [];
	for (const suit in game.pc.collections) {
		if (game.pc.collections[suit] < minCollection && game.pc.collections[suit] !== 0) {
			minCollection = game.pc.collections[suit];
			minCollectionSigns = [suit];
		} else if (
			game.pc.collections[suit] === minCollection &&
			game.pc.collections[suit] !== 0
		) {
			minCollectionSigns.push(suit);
		}
	}
	// find temp array of week cards that are optional to drop
	for (const card of game.pc.deck) {
		for (let suit of minCollectionSigns) {
			if (card.suit == suit &&card.value!==0) 
			weekCards.push(card);
		}
	}
	// random card from the week cards array
	let indexToRemove = Math.floor(Math.random() * weekCards.length);
	let cardToRemove = weekCards[indexToRemove];
	index = game.pc.deck.findIndex(
		(i) => i.value === cardToRemove.value && i.suit === cardToRemove.suit
	);
	if (index !== -1) {
		game.pc.deck.splice(index, 1);
		game.pc.collections[cardToRemove.suit]--;
		game.trashStack.push(weekCards[indexToRemove]);
		game.kupa_card = game.trashStack[game.trashStack.length - 1];
		game.player.isTurn = true;
		game.pc.isTurn = false;
		renderBoard();
		CheckWin(game.pc);
	}
}

function pcBot() {
	let MaxSuit = findMaxCollectionSigns(game.pc.collections);
	console.log(MaxSuit);
	for (let item of MaxSuit) {
		if (item === game.kupa_card.suit||0 ===game.kupa_card.value) {
			console.log('same sign draw');
			game.pc.collections[item]++;
			console.log(game.pc.collections);
			drawCardFromPile();;
		}
	}
	drawCardpc();
	console.log('game.pc draw');
	setTimeout(() => {
		// drawCardFromPile();
		findMinCollectionSigns();
		
		console.log('Delayed for 2 second.');
	}, 2000);
}
function drawCard() {
	console.log('card draw');
	if (game.deck.length === 0) {
		game.deck = game.trashStack;
		game.trashStack = [];
		shuffle(game.deck);
	}
	if (game.player.isTurn && game.player.deck.length === 13) {
		game.player.deck.push(game.deck.pop());
		// renderBoard();
		renderBoard();
	}
}
function drawCardpc() {
	console.log('game.pc card draw');
	if (game.deck.length === 0) {
		game.deck = game.trashStack;
		game.trashStack = [];
		shuffle(game.deck);
	} else if (game.pc.isTurn && game.pc.deck.length === 13) {
		let card = game.deck.pop();
		game.pc.collections[card.suit]++;
		game.pc.deck.push(card);
	}
	renderBoard();
}
function drawCardFromPile() {
	console.log('card draw from pile');
	if (game.player.isTurn && game.player.deck.length === 13) {
		game.player.deck.push(game.kupa_card);
		drawKupa();
	} else if (game.pc.isTurn && game.pc.deck.length === 13) {
		game.pc.deck.push(game.kupa_card);
		drawKupa();
	}

	renderBoard();
}
function drawKupa() {
	if (game.trashStack.length === 0) {
		console.log("empty kupa");
		game.kupa_card = game.deck.pop();
	} else {
		game.kupa_card = game.trashStack.pop();
	}
	if (game.deck.length === 0) {
		game.deck = game.trashStack;
	}
	renderBoard();
}
//TODO add joker 
function CheckWin(player) {
	let currSign = player.deck[12].suit;
	let jokers=0;
	for (let i = 0; i < 13; i++) {
		if (0 === player.deck[i].value) {
			jokers++;
		}
	}
	console.log(jokers);
	// console.log(currSign);
	let i=jokers;
	for (i ; i < 13; i++) {
		if (currSign != player.deck[i].suit) {
			return false;
		}
	}
	console.log(player.name + ' Win');
	winGame(player);
	return true;
}
function startGame() {
	game.player.name = document.getElementById('name').value;
	document.querySelector('.login').style.visibility = 'hidden';
	document.querySelector('.container').style.visibility = 'visible';
	loadGame(game.player.name);
	
	renderBoard();
}
function winGame(player) {
	console.log(game.player.name);
	localStorage.removeItem(game.player.name);
	document.getElementById('name').value = '';
	document.querySelector('.container').style.visibility = 'hidden';
	document.querySelector('.label').innerHTML ='Congrats ' + player.name + ' You win!';
	document.querySelector('.btn').innerHTML = 'Restart';
	document.querySelector('.login').style.visibility = 'visible';
}


function saveToStorage(key, val) {
	localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
	var val = localStorage.getItem(key);
	return JSON.parse(val);
}
function loadGame(name) {
	console.log(name);
	savedGame = loadFromStorage(name);
	console.log(savedGame);
	if (!savedGame) {
		game.kupa_card = '';
		game.deck = [];
		game.trashStack = [];
		game.player.isTurn = true;
		game.pc.isTurn = false;
		for (const suit in game.pc.collections) {
			game.pc.collections[suit]=0;
		}
		// console.log(game.pc.collections);
		for (let suit of suits) {
			for (let value of ranks) {
				game.deck.push({ value, suit });
			}
		}
		game.deck.push({ value: 0, suit: 'red' });
		game.deck.push({ value: 0, suit: 'black' });
		shuffle(game.deck);
		game.kupa_card = game.deck.pop();
		game.trashStack.push(game.kupa_card);
		dealCards();
	}
	else{
		console.log("alredy saved");
		game=savedGame;
		if(game.pc.isTurn){
			pcBot();
		}
	}
}
function saveGame(player) {
	saveToStorage(player, game);
}
function reset(){
	// console.log(game.player.name);
	localStorage.removeItem(game.player.name);
	loadGame(game.player.name);
	renderBoard();
}
// function undo(){
// 	console.log(history);
// 	console.log("undoo");
// 	game=history.pop();
// 	console.log(game);
// 	renderBoard();
// }
