/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var PopUp = require('../../util/PopUp');
var GridLayoutPanel = require('../../util/GridLayoutPanel');
var MenuItem = require('./MenuItem');
var WordUnscramble = require('../WordUnscramble');
var ContextGroups = require('../ContextGroups');
var ImageWordMatch = require('../ImageWordMatch');

/**
 * Menu UI that allows accessing to all the EnglishChallenges.
 * @class EnglishChallengesMenu
 * @extends PopUp
 * @constructor
 */
var EnglishChallengesMenu = function() {
    PopUp.call(this, 'popUpBg', null, 'English Challenges');
    var dimensions = {numberOfRows: 2, numberOfColumns: 4};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 80;
    this.addChild(this.panel);
    this.createGames();
};

EnglishChallengesMenu.prototype = Object.create(PopUp.prototype);
EnglishChallengesMenu.prototype.constructor = EnglishChallengesMenu;

/**
 * Creates the menu, it adds an icon for every EnglishChallenge, so the player
 * can access them.
 * @method EnglishChallengesMenu.createGames
 */
EnglishChallengesMenu.prototype.createGames = function() {
    var challenges = [];
    challenges.push(new WordUnscramble());
    challenges.push(new ContextGroups());
    challenges.push(new ImageWordMatch());
    var i;
    for (i in challenges) {
        this.panel.addElement(new MenuItem(challenges[i], this));
        level.game.add.existing(challenges[i]);
    }
};

module.exports = EnglishChallengesMenu;
