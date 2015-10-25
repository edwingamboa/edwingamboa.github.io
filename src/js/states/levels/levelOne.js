/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var NameBoard = require('../../worldElements/NameBoard');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;
/**
 * Number of places form vocabulary for this level.
 * @type {number}
 */
var NUMBER_OF_PLACES = 4;
/**
 * Number of houses player should visit during this level.
 * @type {number}
 */
var NUMBER_OF_HOUSES = 2;

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
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addPlaces();
    this.addRevolver(2000, 400, false);
    this.addRevolver(3000, 400, false);
};

/**
 * Add InteractiveCar and InteractiveHouses for this level.
 * @method LevelOne.addObjects
 */
LevelOne.prototype.addObjects = function() {
    var playerHouse = level.game.make.sprite(5, this.GROUND_HEIGHT,
        'orangeHouse');
    playerHouse.anchor.set(0, 1);
    this.addObject(playerHouse);


    var gunsStore = new InteractiveHouse(
        this.firstCheckPointX * 1.4,
        this.GROUND_HEIGHT,
        'redHouse'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    this.addObject(new NameBoard(this.firstCheckPointX * 1.35,
        this.GROUND_HEIGHT, 'First Street'));

    var friendsHouse = new InteractiveHouse(5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'blueHouse'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(3 * this.checkPointsDistance, 'jeep');
    //this.addCar(40, 'jeep');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(this.firstCheckPointX * 1.2, 'friend',
        'comic2');
};

/**
 * Adds this level enemies.
 * @method LevelOne.addEnemies
 */
LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.75;
    var y = level.WORLD_HEIGHT - 200;
    var numberOfEnemies = 3;
    for (var i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x, y);
        }
        numberOfEnemies ++;
        x += this.checkPointsDistance;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelOne.addPlaces
 */
LevelOne.prototype.addPlaces = function() {
    var placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    var x = level.WORLD_WIDTH / (NUMBER_OF_PLACES + 2);
    var place;
    var i;
    for (i = 0; i < placesKeys.length; i++) {
        place = level.game.make.sprite(x * (i + 1), this.GROUND_HEIGHT,
            placesKeys[i]);
        place.anchor.set(0, 1);
        this.addObject(place);
    }
};

module.exports = LevelOne;
