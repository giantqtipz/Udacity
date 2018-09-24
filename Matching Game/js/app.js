(function(){

/** 
	Memory Game

	4 Levels of Difficulty - The first 3 allows a limited number of moves, 
	while the last one allows 30 seconds to solve the game.
	
**/

// Shuffle function from http://stackoverflow.com/a/2450976

// The Shuffle function will return Nodes, which is NOT an array.
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*****	Start Frame	*****/
var startFrame = document.querySelector(".start");
var startButton = document.querySelector(".start button");
var difficultyLevel; // Holds difficulty level, which is determined once the start button is pressed.


/*****	Card Selectors & Selected Cards Array	*****/
var cards = document.querySelectorAll(".card");
var selections = [];


/*****	Buttons Selectors	*****/
var pauseButton = document.querySelector(".pause");
var restartButton = document.querySelector(".restart");


/*****	Ratings Selector	*****/
var stars = document.querySelectorAll(".stars li");


/*****	Interval Outside Timing Function (so it can be cleared properly, otherwise it keeps running even when game is over)	*****/
var clock = document.querySelector(".clock");
var timingInterval;


/*****	Game Conditions Based On Difficulty Chosen	*****/
var totalMoves = 0;
var movesAllowed = 0;
var time = 0;
var timeAllowed = 0;
var matchCount = 0;


/*****	Shuffle Cards Using the Shuffle Function *****/
var shuffleCards = function() {
	var deck = document.querySelector(".deck");
	
	var cardsArray = Array.from(cards); // Convert the node into an array of items.
	var shuffledCards = shuffle(cardsArray);

	for (var card of shuffledCards){ deck.appendChild(card); } // Append shuffled card into the deck (parent) as children.	
}

/*****	Start Game Function -- Upon Clicking the Start Button *****/
var gameState = {
	init: function(){
		difficultyLevel = document.querySelector('input[name="level"]:checked').value;
		conditions.difficulty(difficultyLevel);

		startFrame.classList.remove("active");
		timer.counter("start");
		display.moves();
		
		shuffleCards();
	},
	restart: function(){
		startFrame.classList.add("active");
		
		timer.counter("reset");
		reset.allCards(cards);
		reset.stars(stars);
		reset.conditions();
		shuffleCards();
	}
}

/*****	Display Function Showing Total Moves, Stars (Lives Left) *****/
var display = {
	moves: function() {
		var moves = document.querySelector(".moves");
		moves.innerText = totalMoves + " Moves / " + movesAllowed;
	},
	stars: function(move){
		// How can I make this more dynamic? I tried lastChild but couldn't get it to work...
		for(i=0;i<stars.length;i++){
			if(move === Math.floor(movesAllowed * .33)) {
				stars[5].style.opacity = 0;
				stars[2].style.opacity = 0;
			} else if (move === Math.floor(movesAllowed * .66) ) {
	      		stars[4].style.opacity = 0;
	      		stars[1].style.opacity = 0;
	    	} else if (move === movesAllowed) {
	      		star[3].style.opacity = 0;
	      		star[0].style.opacity = 0;
	    	}
		}
	}
}

/*****	Game Conditions - Wins, Game Over, Difficulty *****/
var conditions = {
	difficulty: function(level){
		if(level === "easy") {
			movesAllowed = 25;
		} else if (level === "medium"){
			movesAllowed = 20;
		} else if (level === "hard"){
			movesAllowed = 16;
		} else if (level === "effing crazy"){
			timeAllowed = 30;
		}

		if (difficultyLevel === "effing crazy") {
			alert("Get ready! You only have " + timeAllowed + " seconds to solve the game!");
		} else if (difficultyLevel !== "effing crazy"){
			alert("Get ready! You only have " + movesAllowed + " moves allowed!");
		}
	},
	win: function(match){
		if(match === cards.length/2){
      		timer.counter("reset");
      		modal.view("win");
		}
	},
	gameOver: function(){
		if(difficultyLevel !== "effing crazy"){
			if(totalMoves === movesAllowed) {
				modal.view("lose");
				timer.counter("reset");
				removeAllListeners();
			}
		} else if(difficultyLevel === "effing crazy"){
			if(time === timeAllowed) {
		 		modal.view("lose");	
		 		timer.counter("reset");
				removeAllListeners();	
			}
		}
	}
}

var modal = {
	view: function(condition){
		var modal = document.querySelector(".modal");
		var winningMessage = document.querySelector(".modal h2")
		var movesMessage = document.querySelector(".modal .total-moves");
		var starsMessage = document.querySelector(".modal .total-stars");
		var modalButton = document.querySelector(".modal button");

		modal.classList.add("active");
		movesMessage.innerText = "Total Moves: " + totalMoves + " | " + "Time Spent: " + time;

		if(condition === "win"){
			winningMessage.innerText = "Good job! Want a cookie? Well buy one yourself, cuz I have no baking skills!!";
		} else if (condition === "lose"){
			winningMessage.innerText = "You suck :P";			
		}

		modalButton.addEventListener("click", function(){
			modal.classList.remove("active");
			gameState.restart();
		});
	}
}


/*****	Timing Function *****/
var timer = {
  counter: function(status){
    if (status === 'start'){
      	timingInterval = setInterval(function() { 
	        time++;
			conditions.gameOver();
	        
	        var minutes = Math.floor(time / 60);
	        var seconds = Math.floor(time % 60);
	        
	        if(seconds < 10){
	          clock.innerText = minutes + ":0" + seconds;
	        } else {
	          clock.innerText = minutes + ":" + seconds;
	        }

      }, 1000);
    } else if(status === "reset"){
    	var stopTime = function(){ clearInterval(timingInterval); }
    	stopTime();
    }
  }
}


/*****	State of Cards - Selected, Toggled, Evaluated, Matched	*****/
var cardState = {
	selected: function(){
		if(selections.length < 2){
			cardState.toggle(this);
			selections.push(this);
			if (selections.length === 2) {
				totalMoves++;
				display.moves();
       			display.stars(totalMoves);
				cardState.evaluate(selections);	// When the selections array has 2 items in it, run the evaluate function			
				conditions.gameOver(); // Pass move into Game Over function to check if it is equivalent to movesAllowed (which will result in game over)
			}
		}
	},
	toggle: function(el){
		el.removeEventListener("click", cardState.selected);
		el.classList.toggle("open");
		el.classList.toggle("show");
	},
	evaluate: function(arr){
		var firstCard = arr[0];
		var secondCard = arr[1];

		// Use Class Name of selected cards to determine if they match
		if(firstCard.firstElementChild.className === secondCard.firstElementChild.className) {
			cardState.matched(firstCard, secondCard);
		}

		if(firstCard.firstElementChild.className !== secondCard.firstElementChild.className) {
			reset.card(firstCard, secondCard);
		}	
	},
	matched: function(first, second){
		// Remove event listeners of cards that have matched
		first.removeEventListener("click", cardState.selected);
		second.removeEventListener("click", cardState.selected);

		// Use setTimeout so we can see the cards animate
		setTimeout(function(){	
			first.classList.add("match");
			second.classList.add("match");
			selections.length = 0;
		}, 500);
	
		matchCount++;
		conditions.win(matchCount); // Passed to win function where total matched is compared with total cards / 2
	}
}


/*****	Reset Function Upon Restarting - Closes all cards, Add back event listeners, and Sets all gaming conditions to 0	*****/
var reset = {
	allCards: function(cards){
		selections.length = 0;
		for (var card of cards){
			card.classList.remove("open", "show", "match");
			card.addEventListener("click", cardState.selected);
		}
	},
	card: function(first, second){
		setTimeout(function(){
			cardState.toggle(first);
			cardState.toggle(second);
			first.addEventListener("click", cardState.selected);
			second.addEventListener("click", cardState.selected);
			selections.length = 0;
		}, 500);
	},
	conditions: function(){
		clock.innerText = 0 + ":" + "00";
		matchCount = 0;
		movesAllowed = 0;
    	totalMoves = 0;
		timeAllowed = 0;
		time = 0;
	},
	stars: function(el){
		for(var star of el){ star.style.opacity = 1; }
	}
}


/*****	(╯°□°）╯︵ ┻━┻	*****/
var pause = function(){ alert("lol --- wait you're seriously pausing?? fine!! (╯°□°）╯︵ ┻━┻"); }
pauseButton.addEventListener("click", pause);


/*****	Remove All Event Listeners - Called when game is over, so no cards can be selected after	*****/
var removeAllListeners = function(){
	for(var card of cards) { card.removeEventListener("click", cardState.selected); }
}


/*****	Attach Event Listeners To Each Card	 *****/
for(var card of cards){ card.addEventListener("click", cardState.selected);	}


/*****	Start And Restart Game Upon Clicking The Respective Buttons	 *****/
startButton.addEventListener("click", gameState.init);
restartButton.addEventListener("click", gameState.restart);
  
})();
