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
var VocabularyItem = require('../../items/VocabularyItem');

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
    this.createPlaces();
    this.addNPCs();
    //this.addEnemies();
    this.addObjects();
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

    var messages = ['You can buy a weapon using the store'];
    var titles = ['Buying weapons'];
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
    titles = ['Continue trying', 'Continue trying'];
    imagesKeys = ['emptyRoom', 'emptyRoom'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0,
        'family',
        'Family',
        'A group of people who are related to each other',
        1,
        false
    );
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    var friendsHouse = new InteractiveHouse(5 * this.checkPointsDistance,
        this.GROUND_HEIGHT, 'blueHouse', 'House',
        'A building in which a family lives', 3, interactionManager);
    this.addVocabularyItem(friendsHouse);
    this.addNeighbors(friendsHouse, 'orangeHouse', 'yellowHouse');

    messages = ['Oh Great, those are my wife\'s glasses!'];
    titles = ['My wife\'s glasses'];
    imagesKeys = ['glasses'];

    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0,
        'wife',
        'Wife',
        'A married woman; the woman someone is married to',
        1,
        false
    );
    vocabularyItems.push(vocabularyItem);

    interactionManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    var glasses = new ClueItem(300, this.GROUND_HEIGHT + 10,
        'glasses',
        'Glasses',
        'A hard usually transparent material that is used ' +
        '\nfor making windows and other products',
        3,
        interactionManager
    );
    this.addVocabularyItem(glasses);

    messages = ['Oh Great, that is my wife\'s watch!'];
    titles = ['My wife\'s watch'];
    imagesKeys = ['watch'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var watch = new ClueItem(this.WORLD_WIDTH / 2, this.GROUND_HEIGHT,
        'watch',
        'Watch',
        'A pair of glass or plastic lenses set into a frame ' +
        '\nand worn over the eyes to help a person see',
        3,
        interactionManager
    );
    this.addVocabularyItem(watch);

    //this.addCar(3.7 * this.checkPointsDistance, 'Jeep', 'jeep', 100, 400, 250);
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var messages = [
        'Are you looking for Carlos? \n Be careful, he is so dangerous',
        'Your wife and children are in \nthe Big Blue House after the Zoo'
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
        'An outdoor area where children can play',
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
