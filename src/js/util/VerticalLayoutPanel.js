/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @constructor
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {number} margin - Margin or space between elements, optional
 * @param {number} yOrigin - Where layout should start adding elements,
 * optional.
 */
var VerticalLayoutPanel = function(backgroundKey, margin, yOrigin) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);
    this.layout = new VerticalLayout(this, margin, yOrigin);
};

VerticalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
VerticalLayoutPanel.prototype.constructor = VerticalLayoutPanel;

/**
 * Adds an element to the Panel vertically.
 * @param element
 */
VerticalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 */
VerticalLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.layout.restartPosition();
};

/**
 * Restatrs the positions of x and y to the origin.
 */
VerticalLayoutPanel.prototype.restartPosition = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPanel;

