/*
    Name: John Freeman
    Date: 4/8/22
    File: blackjack.js
    Information: Contains a Deck class and a series of functions that build up to a blackjack simulation that runs through a series of blackjack games, 
                 collects the results, and performs a basic analysis of the results.
    File History: Created on 7/22/19, edited on 4/8/22
*/


// Creates a Deck class that contains a constructor, a string converter, and the shuffle(), size(), and deal() methods.
class Deck {

    
    // Constructor creates an unshuffled deck where the cards are represented by their value in blackjack
    constructor() {
        this.deck =  [
            2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 
            6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 
            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 
            10, 10, 10, 10, 11, 11, 11, 11
        ];
    }

    
    // Randomly shuffles the deck within its original data structure by randomly picking a card from the deck and moving that card to the back of the deck
    shuffle() {
        for (let i = 0; i < this.deck.length; i++) {
            // use of Math.random() to pick one of the remaining unshuffled cards in the deck
            let pickIndex = Math.floor(Math.random() * (this.deck.length - i));
            let pick = this.deck[pickIndex];
            this.deck = this.deck.filter((_x, j) => j != pickIndex);
            this.deck.push(pick);
        }
        return this.deck;
    }

    get size() {
        return this.deck.length;
    }

    
    // Deals a card to the inputted hand by pushing the card to the hand array and removing it from the deck
    deal(hand) {
        hand.push(this.deck.shift());
    }

    toString() {
        return `${this.deck}`;
    }

}


// Determines the value of the inputted hand
function value(hand) {
    return hand.reduce((t, v) => t + v);
}

// Determines whether the inputted hand has a value over 21
function over21(hand) {
    // use of chained if and else if statements helps account for the edge case where a hand with a value over 21 has an ace, because in that case the ace's value will change from 11 to 1
    if (value(hand) > 21 && !(hand.includes(11))) {
        return true; 
    } else if (value(hand) > 21) {
        // makes certain to only change the value of the first ace in the hand
        hand.splice(hand.indexOf(11), 1);
        hand.push(1);
    }
    return false;
}


// Determines whether the player will hit or stand (where true equals hit and false equals stand) based on a simple decision rule
function simplePlayer(hand) {
    return value(hand) < 16;
}


// Determines whether the dealer will hit or stand (where true equals hit and false equals stand)
function dealer(hand) {
    return value(hand) < 17 || (value(hand) == 17 && hand.includes(11));
}

// Represents the course of a blackjack game where the player's and the dealer's actions are automated based on differing decision rules
function game(deck, player = simplePlayer) {
    // Set-Up Phase: sets up the player's and dealer's initial hands
    let dealerHand = [];
    let playerHand = [];
    deck.deal(playerHand);
    deck.deal(dealerHand);
    deck.deal(playerHand);
    deck.deal(dealerHand);

    // Check Phase: checks whether one win condition for the player has been accomplished
    if (value(playerHand) == 21) {
        if (value(dealerHand) == 21) {
            return "Tie. No one wins.";
        }
        return "Player wins."
    }

    // Main Phase: uses the player's and dealer's decision rules to evaluate their in-game actions and determines whether anybody loses (by going over 21)
    while (player(playerHand)) {
        deck.deal(playerHand);
        if (over21(playerHand)) {
            return "Dealer wins.";
        }
    }
    while (dealer(dealerHand)) {
        deck.deal(dealerHand);
        if (over21(dealerHand)) {
            return "Player wins.";
        }
    }
    
    // End Phase: Determines who wins (if anybody)
    if (value(playerHand) > value(dealerHand)) {
        return "Player wins.";
    } else if (value(playerHand) == value(dealerHand)) {
        return "Tie. No one wins.";
    }
    return "Dealer wins.";
}

// Simulates a number of blackjack games (determined by the numGames parameter), collects the results of each game, and performs a basic analysis on the results
function simulation(deck, numGames = 10000) {
    deck.shuffle();

    let results = [];
    for (let i = 0; i < numGames; i++) {
        // use of if statement makes it so the deck gets regularly replenished
        if (deck.size < 20) {
            deck = new Deck();
            deck.shuffle();
        }
        results.push(game(deck));
    }
    console.log(`Player wins ${Math.round(results.filter(x => x == "Player wins.").length / numGames * 100)}% of the time.`);
    console.log(`No one wins ${Math.round(results.filter(x => x == "Tie. No one wins.").length / numGames * 100)}% of the time.`);
    console.log(`Dealer wins ${Math.round(results.filter(x => x == "Dealer wins.").length / numGames * 100)}% of the time.`);
    //return results;
}

// test code
simulation(new Deck());
