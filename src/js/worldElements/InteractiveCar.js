/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');
var ResourceBar = require('../util/ResourceBar');
var Button = require('../util/Button');

/**
 * Default car speed.
 * @constant
 * @type {number}
 */
var DEFAULT_CAR_SPEED = 400;
/**
 * Default greatest car speed.
 * @constant
 * @type {number}
 */
var DEFAULT_CAR_MAX_SPEED = 500;
/**
 * Car gravity.
 * @constant
 * @type {number}
 */
var CAR_GRAVITY = 30000;
/**
 * Longest distance that car can go.
 * @constant
 * @type {number}
 */
var MAX_DISTANCE = 400;
/**
 * Fuel bar width.
 * @constant
 * @type {number}
 */
var BAR_WIDTH = 100;
/**
 * Fuel bar height.
 * @constant
 * @type {number}
 */
var BAR_HEIGHT = 10;

/**
 * Represents a car, which player can interact with.
 * @class InteractiveCar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Car x coordinate within the world.
 * @param {number} y - Car y coordinate within the world.
 * @param {string} backgroundKey - Car texture key.
 */
var InteractiveCar = function(x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);
    this.occupied = false;
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 1;
    this.remainingGas = MAX_DISTANCE;
    this.maxDistance = MAX_DISTANCE;

    this.gasBar = new ResourceBar(-(this.width - BAR_WIDTH) / 2,
        -this.height - 30, {width: BAR_WIDTH, height: BAR_HEIGHT});
    this.gasBar.visible = false;
    this.addChild(this.gasBar);

    this.getOnButton = new Button ('Get on', this.getOn, this);
    this.getOnButton.x = -(this.width - this.getOnButton.width) / 2;
    this.getOnButton.y = -this.height;
    this.addChild(this.getOnButton);
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

/**
 * Allows the player to get on the car.
 * @method InteractiveCar.getOn
 */
InteractiveCar.prototype.getOn = function() {
    this.gasBar.visible = true;
    this.getOnButton.visible = false;
    level.player.onVehicle = true;
    level.player.relocate(this.x, this.y - 100);
    level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

/**
 * Allows the player to get off the car.
 * @method InteractiveCar.getOff
 */
InteractiveCar.prototype.getOff = function() {
    this.stop();
    level.player.onVehicle = false;
    level.player.relocate(this.x + 100, this.y - 100);
    level.player.resetSpeed();
    level.player.resetGravity();
    this.occupied = false;
};

/**
 * Updates car current state, animations and traveled distance, to stop it when
 * it has traveled the longest possible distance.
 * @method InteractiveCar.update
 */
InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.body.velocity.x = level.player.body.velocity.x;
        if (this.body.velocity.x < 0) {
            this.animations.play('left');
            this.remainingGas --;
        }else if (this.body.velocity.x > 0) {
            this.animations.play('right');
            this.remainingGas --;
        }else if (level.direction > 0) {
            this.frame = this.stopRightFrameIndex;
        }else if (level.direction < 0) {
            this.frame = this.stopLeftFrameIndex;
        }
        if (this.remainingGas <= 0) {
            this.getOff();
        }
        this.gasBar.updateResourceBarLevel(this.remainingGas /
            this.maxDistance);
    }
};

/**
 * Determines whether the car is stopped or not.
 * @method InteractiveCar.isStopped
 * @returns {boolean} - True if car speed = 0, otherwise false.
 */
InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

/**
 * Stops the car, making speed = 0.
 * @method InteractiveCar.stop
 */
InteractiveCar.prototype.stop = function() {
    this.body.velocity.x = 0;
};

module.exports = InteractiveCar;
