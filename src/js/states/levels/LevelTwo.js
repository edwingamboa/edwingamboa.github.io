/**
 * @ignore Created by Edwin Gamboa on 05/11/2015.
 */
var Level = require ('./Level');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var InteractionManager = require('../../util/InteractionManager');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 6;

/**
 * Manages LevelTwo.
 * @class LevelTwo
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelTwo = function(game) {
    Level.call(this, game);
};

LevelTwo.prototype = Object.create(Level.prototype);
LevelTwo.prototype.constructor = LevelTwo;

/**
 * Creates level one specific objects and elements.
 * @method LevelTwo.create
 */
LevelTwo.prototype.create = function() {
    Level.prototype.create.call(this);
    localStorage.setItem('level', 'levelTwo');
    this.nextState = 'levelThree';
    this.game.stage.backgroundColor = '#C2501B';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 2;
    this.numberOfStrongEnemies = 2;
    this.metWife = false;
    this.createPlaces();
    this.addStaticBuildings();
    this.addEnemies();
    this.addStrongestEnemy(this.WORLD_WIDTH - 100);
    this.addClueItems();
    this.addLevelCar('bus', 4.3 * this.checkPointsDistance);
    this.addHealthPacks();
    this.createWeapons();
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelTwo.createWeapons
 */
LevelTwo.prototype.createWeapons = function() {
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelTwo.addClueItems
 */
LevelTwo.prototype.addClueItems = function() {
    var messages = ['Oh Great, that is my wife\'s necklace!'];
    var titles = ['My wife\'s necklace'];
    var imagesKeys = ['necklace'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(400, 'necklace', interactionManager);

    messages = ['Oh Great, that is my wife\'s ring!'];
    titles = ['My wife\'s ring'];
    imagesKeys = ['ring'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(this.WORLD_WIDTH / 2 - 500, 'ring', interactionManager);
};

/**
 * Adds character's wife to the level scene.
 * @method LevelTwo.liberateFamilyMember
 */
LevelTwo.prototype.liberateFamilyMember = function() {
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'husband', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'child', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'friend', false);
    vocabularyItems.push(vocabularyItem);

    var messages = [
        'Hello my husband. I am so happy to see you again.',
        'Yor friend has kidnapped \n our daughter and our son.'
    ];
    var titles = ['Hello!', 'Our children are not here'];
    var imagesKeys = ['wife', 'friend'];
    var intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.wife = this.addNPC(
        this.WORLD_WIDTH - 200,
        'wife',
        intManager
    );
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelTwo.addPlaces
 */
LevelTwo.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bank', 'coffeeShop', 'hospital', 'school', 'factory'];
    this.addPlaces();
};

/**
 * Adds static buildings to this level.
 * @method LevelTwo.addInteractiveBuildings
 */
LevelTwo.prototype.addStaticBuildings = function() {
    var house = this.addStaticBuilding(400, 'trees');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');
    this.addStaticBuilding(this.WORLD_WIDTH - 300, 'yellowHouse');
};

module.exports = LevelTwo;
