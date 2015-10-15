/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var HorizontalLayout = require('./HorizontalLayout');
/**
 * Represents a panel that has a HorizontalLayout to arrange its elements.
 * @param backgroundKey {string} Texture's key for panel's background
 * @param optionals {Array} array containing optional parameters x and/or y
 * coordinates for the panel, it can be undefined (optional)
 * @constructor
 */
var HorizontalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.layout = new HorizontalLayout(this);
};

HorizontalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalLayoutPanel.prototype.constructor = HorizontalLayoutPanel;

/**
 * Adds an element to the Panel horizontally.
 * @param element
 */
HorizontalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPanel;
