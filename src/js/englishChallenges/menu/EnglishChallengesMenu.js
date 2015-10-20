/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var MenuItem = require('./MenuItem');
var WordUnscramble = require('../WordUnscramble');
var ContextGroups = require('../ContextGroups');
var ImageWordMatch = require('../ImageWordMatch');

/**
 * Menu that allows accessing to all the EnglishChallenges.
 * @constructor
 */
var EnglishChallengesMenu = function() {
    var dimensions = {numberOfRows: 2, numberOfColumns: 5};
    GridLayoutPopUp.call(this, 'inventory_background', 'English Challenges',
        dimensions);
    this.createGames();
};

EnglishChallengesMenu.prototype = Object.create(GridLayoutPopUp.prototype);
EnglishChallengesMenu.prototype.constructor = EnglishChallengesMenu;

/**
 * Creates the menu, it adds an icon for every EnglishChallenge, so the player
 * can access them.
 */
EnglishChallengesMenu.prototype.createGames = function() {
    var challenges = [];
    challenges.push(new WordUnscramble());
    challenges.push(new ContextGroups());
    challenges.push(new ImageWordMatch());
    var i;
    for (i in challenges) {
        this.addElement(new MenuItem(challenges[i], this));
        level.game.add.existing(challenges[i]);
    }
};

module.exports = EnglishChallengesMenu;
