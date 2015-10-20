/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {number} margin - Margin or space between elements, optional
 * @constructor
 */
var VerticalLayoutPanel = function(backgroundKey, margin) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);
    this.layout = new VerticalLayout(this, margin);
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

module.exports = VerticalLayoutPanel;

