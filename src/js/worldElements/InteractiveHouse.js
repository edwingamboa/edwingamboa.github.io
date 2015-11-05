/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var Store = require('../items/store/Store');
var Button = require('../util/Button');

/**
 * Represents a House, which player can interact with.
 * @class InteractiveHouse
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - House x coordinate within the world.
 * @param {number} y - House y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {PopUp} dialog - Dialog to be displayed when player interact with
 * the house.
 */
var InteractiveHouse = function(x, y, backgroundKey, dialog) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.getOnButton = new Button ('Get in', this.openActivity, this);
    this.getOnButton.x = (this.width - this.getOnButton.width) / 2;
    this.getOnButton.y = -this.height + 50;

    this.dialog = dialog;
    level.game.add.existing(this.dialog);

    this.addChild(this.getOnButton);
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

/**
 * Displays this house dialog
 * @method InteractiveHouse.openActivity
 */
InteractiveHouse.prototype.openActivity = function() {
    this.dialog.open();
};

module.exports = InteractiveHouse;
