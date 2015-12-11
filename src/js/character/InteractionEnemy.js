/**
 * Created by Edwin Gamboa on 06/12/2015.
 */
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
 * @param {Array} messages - Messages that this enemy has to interact with the
 * player.
 * @param {Array} titles - Title associated to each message.
 * @param {Array} imagesKeys - Icon associated to each message.
 */
var InteractionEnemy = function(spriteKey, maxHealthLevel, x, y, minDetection,
                                maxDetection, minAttack, maxAttack, messages,
                                titles, imagesKeys) {
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
    this.makeDialogs(messages, titles, imagesKeys);
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
        level.lastGoalAimed = true;
    }
};

/**
 * Lets the enemy to show the messages he has for the player. (Interaction)
 */
InteractionEnemy.prototype.openDialogs = function() {
    var i;
    for (i in this.dialogs) {
        this.dialogs[i].open();
    }
};

/**
 * Makes the dialogs that allows this character interact with the player.
 * @method InteractionEnemy.makeDialogs
 */
InteractionEnemy.prototype.makeDialogs = function(messages, titles,
                                                  imagesKeys) {
    this.dialogs = [];
    var i;
    var tempDialog;
    for (i in messages) {
        tempDialog =  new VerticalLayoutPopUp('mediumPopUpBg', null, titles[i]);
        var dialogImage = level.game.make.sprite(0, 0, imagesKeys[i]);
        var dialogText = level.game.make.text(0, 0, messages[i]);
        dialogText.font = 'Arial';
        dialogText.fontSize = 20;
        dialogText.fill = '#000000';
        dialogText.align = 'center';
        tempDialog.addElement(dialogImage);
        tempDialog.addElement(dialogText);
        this.dialogs.push(tempDialog);
        level.game.add.existing(tempDialog);
    }
};

module.exports = InteractionEnemy;

