/**
 * @ignore Created by Edwin Gamboa on 15/10/2015.
 */

var HorizontalLayout = require('./HorizontalLayout');
/**
 * Represents a panel that has a HorizontalLayout to arrange its elements.
 * @class HorizontalLayoutPanel
 * @extends Phaser.Sprite
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {Object} [optionals.x = 0] - X coordinate for the panel within its
 * parent view.
 * @param {Object} [optionals.y = 0] - Y coordinate for the panel within its
 * parent view.
 * @constructor
 */
var HorizontalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    var margin = ops.margin || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.layout = new HorizontalLayout(this, margin);
};

HorizontalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalLayoutPanel.prototype.constructor = HorizontalLayoutPanel;

/**
 * Adds an element to the Panel horizontally.
 * @method HorizontalLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element to be added to the panel.
 */
HorizontalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPanel;
