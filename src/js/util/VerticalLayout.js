/**
 * Created by Edwin Gamboa on 13/10/2015.
 */
/**
 * Margin to hold between elements
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Allow control for a Vertical Layout Sprite.
 * @param {Phaser.Sprite} parent Sprite that contatins the layout.
 * @constructor
 */
var VerticalLayout = function(parent) {
    this.currentY = MARGIN;
    this.parent = parent;
};

VerticalLayout.prototype.constructor = VerticalLayout;

/**
 * Adds a element as a child to the parent Sprite, is add the elment vercially
 * bellow the last element and centered on x axis.
 * @param {Phaser.Sprite} element Element to be added to the Sprite
 */
VerticalLayout.prototype.addElement = function(element) {
    element.y = this.currentY;
    this.currentY += element.height + MARGIN;
    element.x = this.parent.width / 2 - element.width / 2;

    this.parent.addChild(element);
};

module.exports = VerticalLayout;
