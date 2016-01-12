/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

/**
 * Represents the enemies that can interact with the player.
 * @class InteractionEnemy
 * @extends Enemy
 * @constructor
 * @param {string} spriteKey - Texture's key for the enemy sprite.
 * @param {number} maxHealthLevel - Greatest health level for this enemy.
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @param {number} minDetection - Lowest distance in which the enemy can
 * detect the player.
 * @param {number} maxDetection - Longest distance in which the enemy can
 * detect the player.
 * @param {number} minAttack - Lowest distance in which the enemy can
 * shoot the player.
 * @param {number} maxAttack - Longest distance in which the enemy can
 * shoot the player.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player
 */
var InteractionEnemy = function(spriteKey, maxHealthLevel, x, y, minDetection,
                                maxDetection, minAttack, maxAttack,
                                interactionManager) {
    Enemy.call(
        this,
        spriteKey,
        maxHealthLevel,
        x,
        y,
        minDetection,
        maxDetection,
        minAttack,
        maxAttack
    );
    this.interactionManager = interactionManager;
};

InteractionEnemy.prototype = Object.create(Enemy.prototype);
InteractionEnemy.prototype.constructor = InteractionEnemy;

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is less than or equal to 10, then character will stop fighting and will ask
 * for pardon.
 * @method InteractionEnemy.decreaseHealthLevel
 * @param {number} decrease - the amount to decrease.
 */
InteractionEnemy.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 10 && !level.lastGoalAimed) {
        this.killWeapons();
        this.canFire = false;
        this.openDialogs();
        level.liberateFamilyMember();
        level.enemies.removeChild(this);
        level.game.add.existing(this);
    }
};

/**
 * Lets the enemy to show the messages he has for the player. (Interaction)
 * @method  InteractionEnemy.openDialogs

 */
InteractionEnemy.prototype.openDialogs = function() {
    this.interactionManager.openDialogs();
};

module.exports = InteractionEnemy;

