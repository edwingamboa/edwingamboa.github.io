/**
 * Created by Edwin Gamboa on 05/11/2015.
 */
var Level = require ('./Level');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/ClueItem');

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
    //this.addEnemies();
    this.addStrongestEnemy(this.WORLD_WIDTH - 100);
    this.addObjects();
    this.createPlaces();
    this.addHealthPacks();
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
 * @method LevelTwo.addObjects
 */
LevelTwo.prototype.addObjects = function() {
    var messages = ['That is my wife\'s necklace!'];
    var titles = ['My wife\'s necklace'];
    var imagesKeys = ['necklace'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var necklace = new ClueItem(300, this.GROUND_HEIGHT,
        'necklace',
        'Necklace',
        'A piece of jewelry that is worn around your neck',
        3);
    this.addVocabularyItem(necklace);
    this.addCar(3.7 * this.checkPointsDistance, 'bus');
};

/**
 * Adds character's wife to the level scene.
 * @method LevelTwo.addWife
 */
LevelTwo.prototype.addWife = function() {
    var message = 'Hello. I am so happy to see you again.' +
        '\nBut our children are not here.' +
        '\nYor friend has our daughter and \nour son.';
    this.wife = this.addNPC(this.checkPointsDistance *
        (NUMBER_OF_FIGHTING_POINTS), 'wife', message);
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelTwo.addPlaces
 */
LevelTwo.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bank', 'coffeeShop', 'hospital', 'school', 'factory'];
    this.placesNames = ['Bank', 'Coffee Shop', 'Hospital', 'School',
        'Old Factory'];
    this.placesDescriptions = [
        'An organization that keeps and lends money',
        'A small restaurant that serves coffee and' +
        '\nother drinks as well as simple foods',
        'A place where sick or injured people' +
        '\nare given medical care',
        'A place for education; a place where' +
        '\npeople go to learn',
        'A building or group of buildings' +
        '\nwhere products are made'
    ];
    this.addPlaces();
};

module.exports = LevelTwo;
