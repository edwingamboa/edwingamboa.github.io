/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */
var GridLayout = require('./GridLayout');

/**
 * Lowest number of columns for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_COLUMNS = 1;
/**
 * Lowest number of rows for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_ROWS = 1;

/**
 * Represents a Panel that uses a GridLayout to arrange its elements.
 * @class GridLayoutPanel
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {Object} [optionals.x] - X coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.y] - Y coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.numberOfColumns] - Number of columns for the
 * panel.
 * @param {Object} [optionals.numberOfRows] - Number of rows for the panel.
 */
var GridLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0, 0,
        this, ops.margin);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

/**
 * Add an element to the panel.
 * @method GridLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element ot be added to the panel.
 */
GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 * @method GridLayoutPanel.removeAllElements
 */
GridLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.grid.restartIndexes();
};

module.exports = GridLayoutPanel;
