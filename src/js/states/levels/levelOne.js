/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var InteractionManager = require('../../util/InteractionManager');
var ClueItem = require('../../items/ClueItem');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;

/**
 * Manages LevelOne.
 * @class LevelOne
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Pahser Game object.
 */
var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

/**
 * Creates level one specific objects and elements.
 * @method LevelOne.create
 */
LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    this.nextState = 'levelTwo';
    this.game.stage.backgroundColor = '#C7D2FC';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 3;
    this.numberOfStrongEnemies = 0;
    this.addNPCs();
    //this.addEnemies();
    this.addObjects();
    this.createPlaces();
    this.addHealthPacks();
};

/**
 * Creates the needed arrays to add level weapons
 */
LevelOne.prototype.createWeapons = function() {
    this.addRevolver(3000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Add InteractiveCar and InteractiveHouses for this level.
 * @method LevelOne.createWeapons
 */
LevelOne.prototype.addObjects = function() {
    var playerHouse = this.addStaticBuilding(5, 'orangeHouse');

    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');

    var messages = ['Use the store to buy a weapon.'];
    var titles = ['Buy weapons'];
    var imagesKeys = ['store'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var gunsStore = new InteractiveHouse(this.firstCheckPointX * 1.4,
        this.GROUND_HEIGHT, 'store', 'Store',
        'A building or room where things are sold', 0, interactionManager);
    this.addVocabularyItem(gunsStore);
    this.addNeighbors(gunsStore, 'orangeHouse', 'yellowHouse');

    messages = ['Your family is now somewhere else.',
        'Continue trying, because this game is just starting!'];
    titles = ['Your family is not here', 'Your family is not here'];
    imagesKeys = ['emptyRoom', 'emptyRoom'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var friendsHouse = new InteractiveHouse(5 * this.checkPointsDistance,
        this.GROUND_HEIGHT, 'blueHouse', 'vocabulary name',
        'vocabulary description', 3, interactionManager);
    this.addVocabularyItem(friendsHouse);
    this.addNeighbors(friendsHouse, 'orangeHouse', 'yellowHouse');

    this.addCar(3.7 * this.checkPointsDistance, 'jeep');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var messages = [
        'I know that you are looking for \nyour family.',
        'Yor wife and children are in \nthe Big Blue House after the Zoo.'
    ];
    var titles = ['I can help you', 'Go to Big Blue House'];
    var imagesKeys = ['npc', 'blueHouse'];
    this.addNPC(this.game.camera.width / 2, 'npc', messages, titles,
        imagesKeys);
};

/**
 * Creates the needed arrays to add this level places
 * @method LevelOne.createPlaces
 */
LevelOne.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    this.placesNames = ['Bookstore', 'Playground', 'Gas Station', 'Zoo'];
    this.placesDescriptions = [
        'A store that sells books',
        'An outdoor area where children can play.',
        'A place where gasoline for vehicles is sold',
        'A place where many kinds of animals are ' +
        '\nkept so that people can see them'
    ];
    this.addPlaces();
};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
LevelOne.prototype.playerWins = function() {
    return this.player.x >= (this.WORLD_WIDTH - this.player.width);
};

module.exports = LevelOne;
