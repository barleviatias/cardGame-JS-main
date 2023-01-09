const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
var player1 = {
	name: '',
	deck: [],
	isTurn: true,
};
// var pc = {
// 	name: 'pc',
// 	deck: [],
// 	isTurn: false,
// };
var pc = {
	name: 'PC',
	deck: [],
	collections:{
		'hearts':0,
		'diamonds':0,
		'spades':0,
		'clubs':0
	},
	isTurn: false,
};
let trashStack;
let kupa_card;
let deck;

function dealCards() {
	player1.deck = [];
	pc.deck = [];
	for (let i = 0; i < 13; i++) {
		player1.deck.push(deck.pop());
	}
	for (let i = 0; i < 13; i++) {
		let tempCard=deck.pop()
		pc.collections[tempCard.suit]++;
		pc.deck.push(tempCard);
		
	}
}
function createCardHTML(rank, suit,isClick) {
	if (isClick)
	return `<div data-rank="${rank}" data-suit="${suit}" onClick="cardClick(this)" class="card"><img src="./images/images/${rank}_of_${suit}.png" alt=""></div>`;
	else
	return `<div data-rank="${rank}" data-suit="${suit}" class=""><img src="./images/images/${rank}_of_${suit}.png" alt=""></div>`;

}
function renderBoard() {
	let htmlDeck1 = '';
	let htmlDeck2 = '';
	let htmlTurn = player1.name + ' playing 👆🏻';
	player1.deck.sort(compareCards);
	pc.deck.sort(compareCards);
	for (const card of player1.deck) {
		htmlDeck1 += createCardHTML(card.value, card.suit,true);
	}
	for (const card of pc.deck) {
		htmlDeck2 += createCardHTML(card.value, card.suit,false);
	}
	if (!player1.isTurn) {
		htmlTurn = pc.name + ' playing 👇🏻';
		document.querySelector('.pc').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.player1').style.backgroundColor =
			'rgb(169, 255, 255,0)';
	} else {
		document.querySelector('.player1').style.backgroundColor =
			'rgb(169, 255, 255,0.20)';
		document.querySelector('.pc').style.backgroundColor =
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
	document.querySelector('.pc').innerHTML = htmlDeck2;

	console.log(pc.collections);
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
			pc.isTurn = true;
		}
	}
		renderBoard();
		setTimeout(() => {
			// drawCardFromPile();
			// findMinCollectionSigns(pc);
			// renderBoard();
			pcBot();
			console.log("Delayed for 5 second.");
		  }, 5000)
		// 	CheckWin(pc);
		// 	player1.isTurn = true;
		// 	pc.isTurn = false;
		// }
		// pcBot();
	
}
function removeCard(player){

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

  function findMinCollectionSigns(pc) {
	let minCollection = 14;
	let minCollectionSigns = [];
	let weekCards=[];
	for (const suit in pc.collections) {
	  if (pc.collections[suit] < minCollection &&pc.collections[suit]!==0) {
		minCollection = pc.collections[suit];
		minCollectionSigns = [suit];
	  } else if (pc.collections[suit] === minCollection&&pc.collections[suit]!==0) {
		minCollectionSigns.push(suit);
	  }
	}
	// find temp array of week cards that are optional to drop
	for( const card of pc.deck ){
		for(let suit of minCollectionSigns){
			if (card.suit==suit)
			weekCards.push(card);
		}
	}
	// random card from the week cards array
	let indexToRemove=Math.floor(Math.random() * weekCards.length);
	let cardToRemove=weekCards[indexToRemove];
	index = pc.deck.findIndex(
		(i) => i.value === cardToRemove.value && i.suit === cardToRemove.suit
	);
	if (index !== -1) {
			pc.deck.splice(index, 1);;
			// console.log(weekCards[indexToRemove]);
			pc.collections[cardToRemove.suit]--;
			trashStack.push(weekCards[indexToRemove]);
			kupa_card = trashStack[trashStack.length - 1];
			CheckWin(pc);
			player1.isTurn = true;
			pc.isTurn = false;
  }
}

function pcBot(){
	let MaxSuit=findMaxCollectionSigns(pc.collections);
	console.log(MaxSuit);
	for(let item of MaxSuit){
		console.log(item+"="+kupa_card.suit);
		if(item===kupa_card.suit){
			console.log("same sign draw");
			pc.collections[item]++;
			console.log(pc.collections);
			drawCardFromPile();
			// drawCardFromPile();
		}

	}
	drawCardPC();
		console.log("pc draw");
		setTimeout(() => {
			// drawCardFromPile();
			findMinCollectionSigns(pc);
			renderBoard();
			console.log("Delayed for 10 second.");
		  }, 10000)
		

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
		renderBoard();
}
}
function drawCardPC() {
	console.log('pc card draw');
	if (deck.length === 0) {
		// kupa_card=trashStack.pop();
		deck = trashStack;
		trashStack = [];
		shuffle(deck);
	}
	else if (pc.isTurn && pc.deck.length === 13) {
		pc.deck.push(deck.pop());
	}
	renderBoard();
}
function drawCardFromPile() {
	console.log('card draw from pile');
	if (player1.isTurn && player1.deck.length === 13) {
		player1.deck.push(kupa_card);
		drawKupa();
	} else if (pc.isTurn && pc.deck.length === 13) {
		pc.deck.push(kupa_card);
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
	renderBoard();
}

function CheckWin(player) {
	let currSign = player.deck[0].suit;
	// console.log(currSign);
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
	pc.isTurn = false;
	for (let suit of suits) {
		for (let value of ranks) {
			deck.push({ value, suit });
		}
	}
	deck.push({ value:0, suit:"red" } );
	deck.push({ value:0, suit:"black" } );
	console.log(deck);
	// deck.push({ 'joker', 'black' });
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

