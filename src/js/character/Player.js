/*
 * @ignore Created by Edwin Gamboa
 */
var Character = require('./Character');
var Revolver = require('../items/weapons/Revolver');
var MachineGun = require('../items/weapons/MachineGun');

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
    this.score = MINIMUM_SCORE;
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

/**
 * Updates player's current weapon
 * @method Player.weaponKey
 * @param {string} weaponKey - new current weapon's key
 */
Player.prototype.updateCurrentWeapon = function(weaponKey) {
    Character.prototype.updateCurrentWeapon.call(this, weaponKey);
    localStorage.setItem('currentWeapon', weaponKey);
};

/**
 * Loads player's current weapon
 * @method Player.weaponKey
 * @param {string} weaponKey - new current weapon's key
 */
Player.prototype.loadCurrentWeapon = function(weaponKey) {
    Character.prototype.updateCurrentWeapon.call(this, weaponKey);
};

/**
 * Add a new weapon to character's weapons.
 * @method Player.addWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Player.prototype.addWeapon = function(newWeapon) {
    Character.prototype.addWeapon.call(this, newWeapon);
    newWeapon.saveWeapon();
};

/**
 * Loads a weapon that player has acquired.
 * @method Player.loadWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Player.prototype.loadWeapon = function(newWeapon) {
    Character.prototype.addWeapon.call(this, newWeapon);
};

/**
 * Changes player's current weapon, to the next one in the weapons array.
 * Updates currentWeaponIndex property.
 * @method Player.nextWeapon
 */
Player.prototype.nextWeapon = function() {
    Character.prototype.nextWeapon.call(this);
    level.updateAmmoText();
};

/**
 * Loads the player's information from the local store.
 * @method Player.loadPlayer
 */
Player.prototype.loadPlayer = function() {
    if (localStorage.getItem('score') !== null) {
        this.score = parseInt(localStorage.getItem('score'));
    }
    if (localStorage.getItem('healthLevel') !== null) {
        var health = parseInt(localStorage.getItem('healthLevel'));
        if (health > 0) {
            this.healthLevel = health;
        }else {
            this.healthLevel = 100;
            if (this.score > 5) {
                this.score -= 5;
            }else {
                this.score = 0;
            }
            localStorage.setItem('score', this.score);
        }
    }
    this.loadWeapons();
    if (localStorage.getItem('currentWeapon') !== null) {
        this.loadCurrentWeapon(localStorage.getItem('currentWeapon'));
    }else {
        this.useWeapon(new Revolver(700, 100, false));
    }
};

/**
 * Loads the player's weapons from the local store.
 * @method Player.loadPlayer
 */
Player.prototype.loadWeapons = function() {
    var weapon;
    if (localStorage.getItem('revolver') !== null) {
        weapon = new Revolver(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('revolver'));
        this.loadWeapon(weapon);
    }
    if (localStorage.getItem('machineGun') !== null) {
        weapon = new MachineGun(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('machineGun'));
        this.loadWeapon(weapon);
    }
};

module.exports = Player;
