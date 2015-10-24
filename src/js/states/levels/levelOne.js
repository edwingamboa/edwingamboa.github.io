/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');

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
    this.firstCheckPointX = this.game.camera.width * 1.3;
    this.checkPointsDistance = this.game.camera.width + 140;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addRevolver(2000, 400, false);
};

/**
 * Add InteractiveCar and InteractiveHouses for this level.
 * @method LevelOne.addObjects
 */
LevelOne.prototype.addObjects = function() {
    var gunsStore = new InteractiveHouse(
        this.firstCheckPointX + 1.5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    var friendsHouse = new InteractiveHouse(
        this.firstCheckPointX + 5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(this.firstCheckPointX + 3 * this.checkPointsDistance, 'jeep');
    //this.addCar(40, 'jeep');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(this.firstCheckPointX + this.checkPointsDistance, 'friend',
        'comic2');
};

/**
 * Adds this level enemies.
 * @method LevelOne.addEnemies
 */
LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX;
    var y = level.WORLD_HEIGHT / (NUMBER_OF_FIGHTING_POINTS + 1);
    var numberOfEnemies = 3;
    for (var i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 30;
            this.addSimpleEnemy(x, y);
        }
        numberOfEnemies ++;
        x += 2 * this.checkPointsDistance;
    }
};

module.exports = LevelOne;
