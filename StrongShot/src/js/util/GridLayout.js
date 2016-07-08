/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * The margin between the cells if the grid.
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Represents a grid with a fixed number of rows and columns. All the cells have
 * the same height and width.
 * @class GridLayout
 * @constructor
 * @param {number} numberOfColumns - Number of columns for the grid.
 * @param {number} numberOfRows - Number of rows for the grid.
 * @param {Sprite} container - Container in which elements are added
 * @param {number} xOrigin - X coordinate where the grid starts
 * @param {number} yOrigin - Y coordinate where the grid starts
 * @param {number} margin - Space between elements, optional.

 */
var GridLayout = function(numberOfColumns, numberOfRows, xOrigin, yOrigin,
                          container, margin) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.margin = margin || MARGIN;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = this.margin + xOrigin;
        this.yOrigin = this.margin + yOrigin;
    }
    this.rowWidth = (container.width - xOrigin - this.margin * 2) /
        this.numberOfColumns;
    this.rowHeight = (container.height - yOrigin - this.margin * 2) /
        this.numberOfRows;
    this.container = container;
};

GridLayout.prototype.constructor = GridLayout;

/**
 * Adds an element to the container on the next possible cell of the grid.
 * @method GridLayout.addElement
 * @param element {Sprite} Element to be added to the container
 */
GridLayout.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
        if (this.currentRow === this.numberOfRows) {
            return;
        }
    }
    var xCentered = (this.rowWidth / 2) - (element.width / 2);
    element.x = this.xOrigin + (this.rowWidth) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight) *
        this.currentRow + yCentered;

    this.container.addChild(element);
    this.currentColumn ++;
};

/**
 * Restarts the indexes, currentRow and currentColumn.
 * @method GridLayout.restartIndexes
 */
GridLayout.prototype.restartIndexes = function() {
    this.currentColumn = 0;
    this.currentRow = 0;
};

module.exports = GridLayout;
