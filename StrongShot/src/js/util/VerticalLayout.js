/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */
/**
 * Margin to hold between elements
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Allow control for a Vertical Layout Sprite.
 * @class VerticalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - Sprite that contains the layout.
 * @param {number} margin - Margin or space between elements, optional.
 * @param {number} [yOrigin] - Where layout should start adding elements.
 */
var VerticalLayout = function(parent, margin, yOrigin) {
    var y = yOrigin || 0;
    this.margin = margin || MARGIN;
    this.currentY = this.margin + y;
    this.parent = parent;
};

VerticalLayout.prototype.constructor = VerticalLayout;

/**
 * Adds a element as a child to the parent Sprite, is add the elment vercially
 * bellow the last element and centered on x axis.
 * @method VerticalLayout.addElement
 * @param {Phaser.Sprite} element Element to be added to the Sprite
 */
VerticalLayout.prototype.addElement = function(element) {
    element.y = this.currentY;
    this.currentY += element.height + this.margin;
    element.x = this.parent.width / 2 - element.width / 2;

    this.parent.addChild(element);
};

/**
 * Restart the position of y, so that the next element is added at the first
 * position.
 * @method VerticalLayout.restartPosition
 */
VerticalLayout.prototype.restartPosition = function() {
    this.currentY = this.margin;
};

module.exports = VerticalLayout;
