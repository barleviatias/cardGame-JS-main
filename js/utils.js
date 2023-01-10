function compareCards(card1, card2) {
	// Compare the values of the cards

	// If the values are the same, compare the suits
	if (card1.suit < card2.suit) {
		return -1;
	} else if (card1.suit > card2.suit) {
		return 1;
	}
	if (card1.value < card2.value) {
		return -1;
	} else if (card1.value > card2.value) {
		return 1;
	}

	// If the values and suits are the same, the cards are equal
	return 0;
}
// Shuffle the deck
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}