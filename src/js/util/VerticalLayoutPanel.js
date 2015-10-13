/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @param {Level} level Object to access game level elements
 * @param {string} backgroundKey Texture's key for panel's background
 * @param {Array} optionals array containing optional parameters x and/or y
 * coordinates for the panel, it can be undefined (optional)
 * @constructor
 */
var VerticalLayoutPanel = function(level, backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.level = level;
    this.layout = new VerticalLayout(this);
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

