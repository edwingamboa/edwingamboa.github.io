/**
 * Created by Edwin Gamboa on 11/10/2015.
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
 * @param numberOfColumns {number} Number of columns for the grid.
 * @param numberOfRows {number} Number of rows for the grid.
 * @param container {Sprite} Container in which elements are added
 * @constructor
 */
var GridLayout = function(numberOfColumns, numberOfRows, container) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.rowWidth = (container.width - MARGIN * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (container.height - MARGIN * this.numberOfRows) /
        this.numberOfRows;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = MARGIN;
        this.yOrigin = MARGIN;
    }
    this.container = container;
};

GridLayout.prototype.constructor = GridLayout;

/**
 * Adds an element to the container on the next possible cell of the grid.
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
    element.x = this.xOrigin + (this.rowWidth + MARGIN) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight + MARGIN) *
        this.currentRow + yCentered;

    this.container.addChild(element);
    this.currentColumn ++;
};

/**
 * Restarts the indexes, currentRow and currentColumn
 */
GridLayout.prototype.restartsIndexes = function() {
    this.currentColumn = 0;
    this.currentRow = 0;
};

module.exports = GridLayout;
