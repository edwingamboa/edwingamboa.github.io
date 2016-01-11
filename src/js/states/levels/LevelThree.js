/**
 * Created by Edwin Gamboa on 19/11/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/ClueItem');
var Wife = require('../../character/Wife');
var Friend = require('../../character/Friend');
var VocabularyItem = require('../../items/VocabularyItem');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 8;

/**
 * Manages LevelThree.
 * @class LevelThree
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelThree = function(game) {
    Level.call(this, game);
};

LevelThree.prototype = Object.create(Level.prototype);
LevelThree.prototype.constructor = LevelThree;

/**
 * Creates level one specific objects and elements.
 * @method LevelThree.create
 */
LevelThree.prototype.create = function() {
    Level.prototype.create.call(this);
    this.nextState = 'intro';
    this.game.stage.backgroundColor = '#09061F';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 2;
    this.numberOfStrongEnemies = 3;
    //this.addEnemies();
    this.addWife();
    this.addFriend(this.WORLD_WIDTH - 100);
    this.addObjects();
    this.createPlaces();
    this.createWeapons();
    this.addHealthPacks();
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelThree.createWeapons
 */
LevelThree.prototype.createWeapons = function() {
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Creates the needed arrays to add this level places
 */
LevelThree.prototype.createPlaces = function() {
    this.housesKeys = ['yellowHouse', 'greenHouse', 'orangeHouse',
        'whiteHouse'];
    this.placesKeys = ['policeStation', 'fireStation', 'superMarket', 'hotel'];
    this.placesNames = ['Police Station', 'Fire Station', 'Super Market',
        'Hotel'];
    this.placesDescriptions = ['A place where local \n police officers work',
        'a building in which the members of a fire' +
        '\n department and the equipment used to' +
        '\nput out fires are located',
        'a store where customers can buy a variety' +
        '\nof foods and usually household items',
        'a place that has rooms in which people' +
        '\ncan stay especially when they are traveling'];
    this.addPlaces();
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelThree.addObjects
 */
LevelThree.prototype.addObjects = function() {
    var messages = ['Oh Great, that is our son\'s cap!'];
    var titles = ['Our son\'s cap'];
    var imagesKeys = ['cap'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var cap = new ClueItem(300, this.GROUND_HEIGHT,
        'cap',
        'Cap',
        'A small, soft hat that often has a hard curved part' +
        '\n(called a visor) that extends out over your eyes',
        3,
        interactionManager
    );
    this.addVocabularyItem(cap);

    messages = ['Oh Great, that is our daughtere\'s bracelet!'];
    titles = ['My wife\'s bracelet'];
    imagesKeys = ['bracelet'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var bracelet = new ClueItem(this.WORLD_WIDTH / 2, this.GROUND_HEIGHT,
        'bracelet',
        'Bracelet',
        'A piece of jewelry worn on the wrist',
        3,
        interactionManager
    );
    this.addVocabularyItem(bracelet);

    //this.addCar(3.7 * this.checkPointsDistance, 'Taxi1', 'taxi', 200, 500, 100);
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.addWife
 */
LevelThree.prototype.addWife = function() {
    this.wife = new Wife(this.player.x - this.player.width,
        this.GROUND_HEIGHT - 50);
    this.addPlayerCharacter(this.wife);
};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
LevelThree.prototype.playerWins = function() {
    return this.lastGoalAimed;
};

/**
 * Adds the Friend (as Enemy) to enemies group.
 * @method LevelThree.addFriend
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
LevelThree.prototype.addFriend = function(x) {
    this.enemies.add(new Friend(x, this.GROUND_HEIGHT - 100));
};

module.exports = LevelThree;
