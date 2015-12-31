/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Character = require('./Character');
/**
 * Default player speed
 * @constant
 * @type {number}
 */
var SPEED = 250;
/**
 * Default player running speed
 * @constant
 * @type {number}
 */
var MAX_SPEED = 300;
/**
 * Default player gravity
 * @constant
 * @type {number}
 */
var GRAVITY = 300;
/**
 * Default minimum player score, is used at the beginning of the game.
 * @constant
 * @type {number}
 */
var MINIMUM_SCORE = 20;
/**
 * Default initial health level for any character
 * @constant
 * @type {number}
 * @default
 */
var INITIAL_HEALTH_LEVEL = 100;

/**
 * Represents player's character within the game.
 * @class Player
 * @extends Character
 * @constructor
 */
var Player = function() {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, 200, level.GROUND_HEIGHT - 50,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.frame = this.stopRightFrameIndex;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * Allows the player to crouch.
 * @method Player.crouch
 */
Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

/**
 * Increases player's score
 * @method Player.increaseScore
 * @param {number} increase - The amount to increase
 */
Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    level.updateScoreText();
};

/**
 * Increases player's score
 * @method Player.decreaseScore
 * @param {number} decrease - The amount to decrease
 */
Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    level.updateScoreText();
};

/**
 * Updates player health level bar (in the main UI)
 * @method Player.updateHealthLevel
 */
Player.prototype.updateHealthLevel = function() {
    level.updateHealthLevel();
};

/**
 * Updates player's current weapon position.
 * @method Player.update
 */
Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.updateCoordinates(this.x + (level.xDirection * 25),
            this.y + 20);
    }
};

/**
 * Changes player walking and running speeds.
 * @method Player.changeSpeed
 * @param {number} speed - New Player's walking speed.
 * @param {number} maxSpeed - New Player's running speed.
 */
Player.prototype.changeSpeed = function(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
};

/**
 * Resets player walking and running speeds to default values.
 * @method Player.resetSpeed
 */
Player.prototype.resetSpeed = function() {
    this.speed = SPEED;
    this.maxSpeed = MAX_SPEED;
};

/**
 * Changes player gravity.
 * @method Player.changeGravity
 * @param {number} gravity - New player gravity.
 */
Player.prototype.changeGravity = function(gravity) {
    this.body.gravity.y = gravity;
};

/**
 * Resets player gravity to default value.
 * @method Player.resetGravity
 */
Player.prototype.resetGravity = function() {
    this.body.gravity.y = GRAVITY;
};

/**
 * Allows the player to buy an item, when he has enough money (score) to do it.
 * @param {Item} item - Item that is intended to be purchased.
 * @returns {boolean} - true if purchase was successful, otherwise false.
 */
Player.prototype.buyItem = function(item) {
    if (this.score >= item.price) {
        this.score -= item.price;
        return true;
    }else {
        return false;
    }
};

Player.prototype.serialize = function(savePosition) {
    if (savePosition === undefined) savePosition = true;
    var fields = [
        'healthLevel',
        'score'
    ];

    if (savePosition) {
        fields.push('x');
    }

    var obj = {};

    for (var i in fields) {
        var field = fields[i];
        obj[field] = this[field];
    }

    return JSON.stringify(obj);
};

/**
 * This is a class method, not an instance method!
 *
 * @param state string | object the state to unserialize into a character
 *
 * @return Character instance, class depending on the state restored
 */
Player.Unserialize = function(state) {
    // We should be able to accept an object or a string.
    if (typeof state === 'string') {
        state = JSON.parse(state);
    }

    // Default class name
    var className = 'Player';

    // Class name can be specified in the serialized data.
    if (state.options.className) {
        className = state.options.className;
    }

    // Call our character factory to make a new instance of className
    var instance = Player.Factory(
        className,
        game, // Game reference. Required
        0, // x-pos. Required, but overridden by unserialize
        0, // y-pos. Required, but overridden by unserialize
        {} // options. Required, but overridden by unserialize
    );

    // Copy our saved state into the new object
    for (var i in state) {
        instance[i] = state[i];
    }

    return instance;
};

module.exports = Player;
