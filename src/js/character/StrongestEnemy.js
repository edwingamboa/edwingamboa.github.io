/**
 * Created by Edwin Gamboa on 11/11/2015.
 */
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');
var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strongestEnemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 30;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 800;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 500;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongestEnemy
 * @extends Enemy
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @constructor
 */
var StrongestEnemy = function(x, y) {
    Enemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK
    );
    this.useWeapon(new MachineGun(this, x, y, true));

    this.makeDialogs();
};

StrongestEnemy.prototype = Object.create(Enemy.prototype);
StrongestEnemy.prototype.constructor = StrongestEnemy;

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is less than or equal to 10, then character will stop fighting and will ask
 * for pardon.
 * @method StrongestEnemy.decreaseHealthLevel
 * @param {number} decrease - the amount to decrease.
 */
StrongestEnemy.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 10 && !level.lastGoalAimed) {
        this.killWeapons();
        this.canFire = false;
        this.dialogFriend.open();
        this.dialogForgive.open();
        level.lastGoalAimed = true;
    }
};

/**
 * Makes the dialogs that allows this character interact with the player.
 * @method StrongestEnemy.makeDialogs
 */
StrongestEnemy.prototype.makeDialogs = function() {
    this.dialogForgive = new VerticalLayoutPopUp('mediumPopUpBg', null,
        'Forgive me');
    var forgiveImage = level.game.make.sprite(0, 0, 'forgive');
    var forgiveMessage = 'Forgive me please!' +
        '\nI can liberate your wife.';
    var dialogText = level.game.make.text(0, 0, forgiveMessage);
    dialogText.font = 'Arial';
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.dialogForgive.addElement(forgiveImage);
    this.dialogForgive.addElement(dialogText);
    level.game.add.existing(this.dialogForgive);

    this.dialogFriend = new VerticalLayoutPopUp('mediumPopUpBg', null,
        'Your Wife');
    var friendImage = level.game.make.sprite(0, 0, 'mother');
    dialogText.text = 'I can liberate your wife.';
    this.dialogFriend.addElement(friendImage);
    this.dialogFriend.addElement(dialogText);
    level.game.add.existing(this.dialogFriend);
};

module.exports = StrongestEnemy;

