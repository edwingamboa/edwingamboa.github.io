/**
 * @ignore Created by Edwin Gamboa
 */

/**
 * Bounce value for an Item
 * @constant
 * @type {number}
 */
var BOUNCE = 0.7 + Math.random() * 0.2;

/**
 * Represents item that player can pick up an store it in inventory.
 * @class Item
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Item's x coordinate within the world.
 * @param {number} y - Item's y coordinate within the world.
 * @param {string} key - Item texture's key.
 * @param {number} price - Price to purchase or buy this item.
 */
var Item = function(x, y, key, price) {
    Phaser.Sprite.call(this, level.game, x, y, key);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = BOUNCE;
    this.body.collideWorldBounds = true;
    this.price = price;
    this.name = '';
    this.description = '';
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

/**
 * Sets the text description for this item.
 * @method Item.setDescription
 * @param {string} description - Text describing this item.
 */
Item.prototype.setDescription = function(description) {
    this.description = description;
};

/**
 * Sets Item's name.
 * @method Item.setName
 * @param {string} name - Item name.
 */
Item.prototype.setName = function(name) {
    this.name = name;
};

module.exports = Item;
