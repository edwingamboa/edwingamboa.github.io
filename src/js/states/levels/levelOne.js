/**
 * @ignore Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var InteractionManager = require('../../util/InteractionManager');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');

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
    localStorage.setItem('level', 'levelOne');
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
    this.addInteractiveBuildings();
    this.addStaticBuildings();
    this.addNPCs();
    this.addEnemies();
    this.createWeapons();
    this.addClueItems();
    this.addLevelCar('jeep', 3.5 * this.checkPointsDistance);
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
 * Add ClueItems for this level.
 * @method LevelOne.createWeapons
 */
LevelOne.prototype.addClueItems = function() {
    var messages = ['Oh Great, those are my wife\'s glasses!'];
    var titles = ['My wife\'s glasses'];
    var imagesKeys = ['glasses'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'wife', false);
    vocabularyItems.push(vocabularyItem);
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(300, 'glasses', interactionManager);

    messages = ['Oh Great, that is my wife\'s watch!'];
    titles = ['My wife\'s watch'];
    imagesKeys = ['watch'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(this.WORLD_WIDTH / 2, 'watch', interactionManager);
};

/**
 * Adds interactive buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addInteractiveBuildings = function() {
    var messages = ['You can buy a weapon using the store'];
    var titles = ['Buying weapons'];
    var imagesKeys = ['store'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addInteractiveHouse(this.firstCheckPointX * 1.55, 'store',
        interactionManager);

    messages = ['Your family is now somewhere else.',
        'Continue trying, because this game is just starting!'];
    titles = ['Continue trying', 'Continue trying'];
    imagesKeys = ['emptyRoom', 'emptyRoom'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'family', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addInteractiveHouse(5.5 * this.checkPointsDistance, 'blueHouse',
        interactionManager);
};

/**
 * Adds static buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addStaticBuildings = function() {
    this.addStaticBuilding(5, 'orangeHouse');
    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');
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
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    this.addNPC(this.game.camera.width / 2, 'npc', intManager);
};

/**
 * Creates the needed arrays to add this level places
 * @method LevelOne.createPlaces
 */
LevelOne.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    this.addPlaces();
};

module.exports = LevelOne;
