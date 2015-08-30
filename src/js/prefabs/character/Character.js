/**
 * Created by Edwin Gamboa on 08/07/2015.
 */

var SPEED = 150;
var MAX_SPEED = 250;
var INITIAL_HEALTH_LEVEL = 100;
var MAX_HEALTH_LEVEL = 100;
var BOUNCE = 0.2;
var GRAVITY = 300;

/**
 * The Character class handles game characters general behaviour.
 *
 * @param {object} level - represents a game level
 * @param {number} x - character's x coordinate within the world
 * @param {number} y - character's y coordinate within the world
 * @param {string} spriteKey - key that represents the character sprite (preload)
 * @param {object} optionsArgs - character's physic properties
 * @constructor
 */
var Character = function(level, x, y, spriteKey, optionsArgs) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);

    var options = optionsArgs || {};
    this.healthLevel = options.healthLevel || INITIAL_HEALTH_LEVEL;
    this.maxHealthLevel = options.maxHealthLevel || MAX_HEALTH_LEVEL;
    this.speed = options.speed || SPEED;
    this.maxSpeed = options.maxSpeed || MAX_SPEED;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = options.bounce || BOUNCE;
    this.body.gravity.y = options.gravity || GRAVITY;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 1);

    this.currentWeaponIndex = 0;

    this.level = level;
    this.weapons = [];
    this.weaponsKeys = [];
};

/**
 * Character class constructor.
 *
 * @type {Phaser.Sprite}
 */
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 */
Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
};

/**
 * Moves the character in the right direction using normal speed.
 */
Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    this.animations.play('right');
};

/**
 * Moves the character in the left direction using running speed.
 */
Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.maxSpeed;
    this.animations.play('left');
};

/**
 * Moves the character in the right direction using running speed.
 */
Character.prototype.runRight = function() {
    this.body.velocity.x = this.maxSpeed;
    this.animations.play('right');
};

/**
 * Stops the character and its animations.
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 4;
};

/**
 * Determines whether the character's current health level is maxHelathLevel (is
 * full) or not.
 *
 * @returns {boolean}
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
 *
 * @param {number} increase - the amount to increase.
 */
Character.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > this.maxHealthLevel) {
        this.healthLevel = this.maxHealthLevel;
    }
};

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is lees than or equal to 0, then character and its elements will be killed.
 *
 * @param {number} decrease - the amount to decrease.
 */
Character.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 0) {
        this.killCharacter();
    }
};

/**
 * Kill the character and his elements.
 */
Character.prototype.killCharacter = function() {
    for (var weaponKey in this.weapons) {
        this.weapons[weaponKey].killWeapon();
    }
    this.kill();
};

/**
 * Set the character health level.
 *
 * @param {number} healthLevel - the new caharacter's healthLevel.
 */
Character.prototype.setHealthLevel = function(healthLevel) {
    this.healthLevel = healthLevel;
};

/**
 * Updates player's current weapon, the old weapon is killed (out of stage) and
 * the new one is shown on screen. If the new one is a weapon that was killed,
 * then it is revived and shown on screen.
 *
 * @param {string} weaponKey - new current weapon's key
 */
Character.prototype.updateCurrentWeapon = function(weaponKey) {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.kill();
    }
    this.currentWeapon = this.weapons[weaponKey];
    if (!this.currentWeapon.alive) {
        this.currentWeapon.revive();
    }
    this.level.game.add.existing(this.currentWeapon);
};

/**
 * Changes player's current weapon, to the nest one in the weapons array.
 * Updates currentWeaponIndex property.
 */
Character.prototype.nextWeapon = function() {
    this.currentWeaponIndex++;
    if (this.currentWeaponIndex === this.weaponsKeys.length) {
        this.currentWeaponIndex = 0;
    }
    this.updateCurrentWeapon(this.weaponsKeys[this.currentWeaponIndex]);
};

/**
 * Add a new weapon to character's weapons.
 *
 * @param {object} newWeapon - the weapon to be added.
 */
Character.prototype.addWeapon = function(newWeapon) {
    this.weapons[newWeapon.key] = newWeapon;
    this.weaponsKeys.push(newWeapon.key);
};

/**
 * Fires the current weapon if it is defined
 * @param {number} x - x coordinate on the point to fire
 * @param {number} y - y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    this.currentWeapon.fire(x, y);
};

/**
 * Lets to relocate the character on the given coordinates
 * @param {number} x - x coordinate to be relocated
 * @param {number} y - y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

module.exports = Character;
