/**
 * @ignore Created by Edwin Gamboa on 13/11/2015.
 */
var Character  = require('./Character');
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
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class Wife
 * @extends Character
 * @constructor
 * @param {number} x - Wife's x coordinate within game world.
 * @param {number} y - Wife's y coordinate within game world.
 * @return {Wife}
 */
var Wife = function(x, y) {
    Character.call(this, x, y, 'wife');
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.heatlthBar = new ResourceBar(-this.width / 2, -this.height / 2 - 10,
        {width: 40, height: 5});
    this.addChild(this.heatlthBar);
    this.direction = RIGHT_DIRECTION;
};

Wife.prototype = Object.create(Character.prototype);
Wife.prototype.constructor = Wife;

/**
 * Update animations of the wife.
 * @method Wife.update
 */
Wife.prototype.update = function() {
    this.body.velocity.x = level.player.body.velocity.x;
    if (this.body.velocity.x > 0) {
        this.direction = RIGHT_DIRECTION;
        this.animations.play('right');
    }else if (this.body.velocity.x < 0) {
        this.direction = LEFT_DIRECTION;
        this.animations.play('left');
    }else {
        this.animations.stop();
        if (this.direction === RIGHT_DIRECTION) {
            this.frame = this.stopRightFrameIndex;
        }else {
            this.frame = this.stopLeftFrameIndex;
        }
    }
};

/**
 * Updates wife's health level bar.
 * @method Wife.updateHealthLevel
 */
Wife.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

/**
 * Kills the character, so that is not visible and functional in the game.
 * @method Wife.killCharacter
 */
Wife.prototype.killCharacter = function() {
    level.gameOver();
    Character.prototype.killCharacter.call(this);
};

module.exports = Wife;
