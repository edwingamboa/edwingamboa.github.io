/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Default speed for any character
 * @constant
 * @type {number}
 * @default
 */
var SPEED = 150;
/**
 * Default greatest speed for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_SPEED = 250;
/**
 * Default initial health level for any character
 * @constant
 * @type {number}
 * @default
 */
var INITIAL_HEALTH_LEVEL = 100;
/**
 * Default greatest health level for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_HEALTH_LEVEL = 100;
/**
 * Default bounce value for any character
 * @constant
 * @type {number}
 * @default
 */
var BOUNCE = 0.2;
/**
 * Default gravity value for aby character.
 * @constant
 * @type {number}
 * @default
 */
var GRAVITY = 300;

/**
 * Handles game characters general behaviour.
 * @class Character
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Character's x coordinate within the world.
 * @param {number} y - Character's y coordinate within the world.
 * @param {string} spriteKey - Key that represents the character sprite.
 * @param {Object} [optionals] - Character's physic properties.
 * @param {Object} [optionals.healthLevel = INITIAL_HEALTH_LEVEL] - Character's
 * initial health level, when it is 100 at the beginning of a level.
 * @param {Object} [optionals.maxHealthLevel = MAX_HEALTH_LEVEL] - Character's
 * greatest health level, use to increase health level till this number.
 * @param {Object} [optionals.speed = SPEED] - Character's speed, is used when
 * he walks.
 * @param {Object} [optionals.maxSpeed = MAX_SPEED] - Character's maximal speed,
 * it is used when he runs.
 */
var Character = function(x, y, spriteKey, optionals) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);

    var options = optionals || {};
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
    this.onVehicle = false;
    this.canFire = true;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 * @method Character.moveLeft
 */
Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using normal speed.
 * @method Character.moveRight
 */
Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Moves the character in the left direction using running speed.
 * @method Character.runLeft
 */
Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using running speed.
 * @method Character.runRight
 */
Character.prototype.runRight = function() {
    this.body.velocity.x = this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Stops the character and its animations.
 * @method Character.stop
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (level.xDirection > 0) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

/**
 * Determines whether the character's current health level is maxHealthLevel (is
 * full) or not.
 * @method Character.fullHealthLevel
 * @returns {boolean} True if player's health level is the greatest, otherwise
 * false.
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
 * @method Character.increaseHealthLevel
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
 * @method Character.decreaseHealthLevel
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
 * @method Character.killCharacter
 */
Character.prototype.killCharacter = function() {
    this.killWeapons();
    this.kill();
};

/**
 * Kill the character's weapons.
 * @method Character.killWeapons
 */
Character.prototype.killWeapons = function() {
    for (var weaponKey in this.weapons) {
        this.weapons[weaponKey].killWeapon();
    }
};

/**
 * Set the character health level.
 * @method Character.setHealthLevel
 * @param {number} healthLevel - the new caharacter's healthLevel.
 */
Character.prototype.setHealthLevel = function(healthLevel) {
    this.healthLevel = healthLevel;
};

/**
 * Updates player's current weapon, the old weapon is killed (out of stage) and
 * the new one is shown on screen. If the new one is a weapon that was killed,
 * then it is revived and shown on screen.
 * @method Character.weaponKey
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
 * Changes character's current weapon, to the next one in the weapons array.
 * Updates currentWeaponIndex property.
 * @method Character.nextWeapon
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
 * @method Character.addWeapon
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
 * @method Character.fireToXY
 * @param x {number} X coordinate on the point to fire
 * @param y {number} Y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    if (this.canFire) {
        this.currentWeapon.fire(x, y);
    }
};

/**
 * Lets to relocate the character on the given coordinates
 * @method Character.relocate
 * @param x {number} X coordinate to be relocated
 * @param y {number} Y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Updates current weapon, so that character can use it.
 * @method Character.useWeapon
 * @param {Weapon} weapon - Weapon to be used by the character.
 */
Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
        if (level.xDirection > 0) {
            this.currentWeapon.pointToRight();
        }else {
            this.currentWeapon.pointToLeft();
        }
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

/**
 * Allows the character to jump.
 * @method Character.jump
 */
Character.prototype.jump = function() {
    this.body.velocity.y = -350;
};

module.exports = Character;
