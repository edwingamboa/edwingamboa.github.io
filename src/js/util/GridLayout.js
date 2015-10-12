/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var MARGIN = 10;

var GridLayout = function(numberOfColumns, numberOfRows, parent) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.rowWidth = (parent.width - MARGIN * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (parent.height - MARGIN * this.numberOfRows) /
        this.numberOfRows;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = MARGIN;
        this.yOrigin = MARGIN;
    }
    this.parent = parent;
};

GridLayout.prototype.constructor = GridLayout;

GridLayout.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
    }
    var xCentered = (this.rowWidth / 2) - (element.width / 2);
    element.x = this.xOrigin + (this.rowWidth + MARGIN) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight + MARGIN) *
        this.currentRow + yCentered;

    this.parent.addChild(element);
    this.currentColumn ++;
};

module.exports = GridLayout;
