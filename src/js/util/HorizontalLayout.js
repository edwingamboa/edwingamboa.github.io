/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * Default value for the margin between elements.
 * @constant
 * @default
 * @type {number}
 */
var MARGIN = 10;

/**
 * Controls an HorizontalLayout for a view, so that it arranged elements
 * horizontally, one after another, centered on y axis.
 * @class HorizontalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - View on which elements are added and
 * arranged.
 * @param {number} [margin = MARGIN] - Margin between elements.
 */
var HorizontalLayout = function(parent, margin) {
    this.margin = margin || MARGIN;
    this.currentX = this.margin;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

/**
 * Add an element horizontally, after the last one (if any), centered on y axis.
 * @method HorizontalLayout.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentX;
    this.currentX += element.width + this.margin ;
    element.y = this.parent.height / 2 - element.height / 2;
    this.parent.addChild(element);
};

/**
 * Restarts the position of x to the first one, so that new element will be
 * added in first position.
 * @method HorizontalLayout.restartPosition
 */
HorizontalLayout.prototype.restartPosition = function() {
    this.currentX = this.margin;
};

module.exports = HorizontalLayout;
