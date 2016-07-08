/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */
var VocabularyItem = require('./VocabularyItem');
var ResourceBar = require('../../util/ResourceBar');
var Button = require('../../util/Button');

/**
 * Car gravity.
 * @constant
 * @type {number}
 */
var CAR_GRAVITY = 30000;
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
 * @param {string} name - Car name.
 * @param {string} backgroundKey - Car texture key.
 * @param {number} price - Car price
 * @param {number} speed - Car speed
 * @param {number} gasoline - Car max gasoline
 */
var InteractiveCar = function(x,
                              y,
                              backgroundKey,
                              price,
                              speed,
                              gasoline) {
    VocabularyItem.call(this, x, y, backgroundKey, false, price);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);
    this.occupied = false;
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 1;
    this.remainingGas = gasoline;
    this.gasoline = gasoline;
    this.speed = speed;
    this.maxSpeed = speed * 1.5;
    this.description = 'Speed: ' + this.speed +
        '\nGasoline: ' + this.gasoline;
    this.category = 'transport';

    this.gasBar = new ResourceBar(-(this.width - BAR_WIDTH) / 2,
        -this.height - 30, {width: BAR_WIDTH, height: BAR_HEIGHT});
    var fuelIcon = level.game.make.sprite(0, 0, 'gas');
    fuelIcon.anchor.set(1, 0.5);
    this.gasBar.addChild(fuelIcon);
    this.gasBar.visible = false;
    this.addChild(this.gasBar);

    this.getOnButton = new Button ('Get on', this.getOn, this);
    this.getOnButton.x = -(this.width - this.getOnButton.width) / 2;
    this.getOnButton.y = -this.height;
    this.addChild(this.getOnButton);
};

InteractiveCar.prototype = Object.create(VocabularyItem.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

/**
 * Allows the player to get on the car.
 * @method InteractiveCar.getOn
 */
InteractiveCar.prototype.getOn = function() {
    if (this.remainingGas > 0) {
        level.myVocabulary.addItem(this);
        this.gasBar.visible = true;
        this.getOnButton.visible = false;
        level.player.onVehicle = true;
        level.player.relocate(this.x, this.y - 100);
        level.player.changeSpeed(this.speed, this.maxSpeed);
        level.player.changeGravity(CAR_GRAVITY);
        this.occupied = true;
    }
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
            this.gasoline);
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

/**
 * Allows the character to use this car.
 * @method InteractiveCar.use
 */
InteractiveCar.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x + 50;
    this.y = level.GROUND_HEIGHT;
    level.addCar(this);
};

module.exports = InteractiveCar;
