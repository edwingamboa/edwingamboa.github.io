/**
 * Created by Edwin Gamboa on 08/07/2015.
 */

var SPEED = 150;
var MAX_SPEED = 250;
var INITIAL_HEALTH_LEVEL = 100;
var MAX_HEALTH_LEVEL = 100;
var BOUNCE = 0.2;
var GRAVITY = 300;
var RIGHT_DIRECTION = 1;
var LEFT_DIRECTION = -1;

/**
 * Handles game characters general behaviour.
 * @param x {number} - character's x coordinate within the world
 * @param y {number} - character's y coordinate within the world
 * @param spriteKey {string} - key that represents the character sprite (preload)
 * @param  optionsArgs {object}  - character's physic properties
 * @constructor
 */
var Character = function(x, y, spriteKey, optionsArgs) {
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
    this.anchor.setTo(0.5, 0.5);

    this.currentWeaponIndex = 0;

    this.weapons = [];
    this.weaponsKeys = [];
    this.direction = RIGHT_DIRECTION;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 */
Character.prototype.moveLeft = function() {
    this.direction = LEFT_DIRECTION;
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using normal speed.
 */
Character.prototype.moveRight = function() {
    this.direction = RIGHT_DIRECTION;
    this.body.velocity.x = this.speed;
    this.animations.play('right');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Moves the character in the left direction using running speed.
 */
Character.prototype.runLeft = function() {
    this.direction = LEFT_DIRECTION;
    this.body.velocity.x = -this.maxSpeed;
    this.animations.play('left');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using running speed.
 */
Character.prototype.runRight = function() {
    this.direction = RIGHT_DIRECTION;
    this.body.velocity.x = this.maxSpeed;
    this.animations.play('right');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Stops the character and its animations.
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (this.direction > 0) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

/**
 * Determines whether the character's current health level is maxHelathLevel (is
 * full) or not.
 * @returns {boolean}
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
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
    level.game.add.existing(this.currentWeapon);
};

/**
 * Changes player's current weapon, to the next one in the weapons array.
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
 * @param newWeapon {object} The weapon to be added.
 */
Character.prototype.addWeapon = function(newWeapon) {
    if (this.weapons[newWeapon.key] === undefined) {
        this.weaponsKeys.push(newWeapon.key);
    }
    this.weapons[newWeapon.key] = newWeapon;
};

/**
 * Fires the current weapon if it is defined
 * @param x {number} X coordinate on the point to fire
 * @param y {number} Y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    this.currentWeapon.fire(x, y);
};

/**
 * Lets to relocate the character on the given coordinates
 * @param x {number} X coordinate to be relocated
 * @param y {number} Y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
        if (this.direction === RIGHT_DIRECTION) {
            this.currentWeapon.pointToRight();
        }else {
            this.currentWeapon.pointToLeft();
        }
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

module.exports = Character;
