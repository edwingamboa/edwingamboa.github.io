/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('./Character');
var ResourceBar = require('./../util/ResourceBar');

/**
 * Represents the right direction on the screen.
 * @constant
 * @type {number}
 */
var RIGHT_DIRECTION = 1;
/**
 * Represents the left direction on the screen.
 * @constant
 * @type {number}
 */
var LEFT_DIRECTION = -1;

/**
 * Represents an enemy within the game.
 * @class Enemy
 * @extends Character
 * @constructor
 * @param {string} spriteKey - Texture's key for the enemy sprite.
 * @param {number} maxHealthLevel - Greatest health level for this enemy.
 * @param {number} x - Enemy's x coordinate within the game world.
 * @param {number} y - Enemy's y coordinate within the game world.
 * @param {number} minRangeDetection - Lowest distance in which the enemy can
 * detect the player.
 * @param {number} maxRangeDetection - Longest distance in which the enemy can
 * detect the player.
 * @param {number} minRangeAttack - Lowest distance in which the enemy can
 * shoot the player.
 * @param {number} maxRangeAttack - Longest distance in which the enemy can
 * shoot the player.
 */
var Enemy = function(spriteKey,
                     maxHealthLevel,
                     x,
                     y,
                     minRangeDetection,
                     maxRangeDetection,
                     minRangeAttack,
                     maxRangeAttack) {
    var options = {
        healthLevel : maxHealthLevel,
        maxHealthLevel : maxHealthLevel
    };
    Character.call(this, x, y, spriteKey, options);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 2;
    this.rangeDetection = level.game.rnd.integerInRange(minRangeDetection,
        maxRangeDetection);
    this.rangeAttack = level.game.rnd.integerInRange(minRangeAttack,
        maxRangeAttack);
    this.heatlthBar = new ResourceBar(-this.width / 2, -this.height / 2 - 10,
        {width: 40, height: 5});
    this.addChild(this.heatlthBar);
    this.direction = RIGHT_DIRECTION;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update animations and current weapon of the enemy.
 * @method Enemy.update
 */
Enemy.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.direction = RIGHT_DIRECTION;
        this.animations.play('right');
        this.currentWeapon.pointToRight();
    }else if (this.body.velocity.x < 0) {
        this.direction = LEFT_DIRECTION;
        this.animations.play('left');
        this.currentWeapon.pointToLeft();
    }
    this.currentWeapon.updateCoordinates(this.x, this.y);
};

/**
 * Updates enemy's health level bar.
 * @method Enemy.updateHealthLevel
 */
Enemy.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

/**
 * Kills the character, so that is not visible and functional in the game.
 * @method Enemy.killCharacter
 */
Enemy.prototype.killCharacter = function() {
    this.healthLevel = 0;
    level.player.increaseScore(this.maxHealthLevel * 0.5);
    Character.prototype.killCharacter.call(this);
};

/**
 * Rotates enemies current weapon to  certain direction.
 * @method Enemy.rotateWeapon
 * @param {number} x - X coordinate of a point id the direction, where weapon
 * will be rotate.
 * @param {number} y - Y coordinate of a point id the direction, where weapon
 * will be rotate.
 */
Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        level.game.physics.arcade.angleToXY(this, x, y);
};

/**
 * Stops the enemy, its animations an chose the frame to display according to
 * its direction.
 * @method Enemy.stop
 */
Enemy.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (this.direction === RIGHT_DIRECTION) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

module.exports = Enemy;
