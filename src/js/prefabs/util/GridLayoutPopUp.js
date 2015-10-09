/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var NUMBER_OF_COLUMNS = 5;
var NUMBER_OF_ROWS = 3;
var ITEMS_SPACE_LENGTH = 10;
var PopUp = require('../util/PopUp');

var GridLayoutPopUp = function(level, backgroundKey, dimensions) {
    PopUp.call(this, level, backgroundKey);
    this.level = level;
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || NUMBER_OF_ROWS;

    this.rowWidth = (this.width - ITEMS_SPACE_LENGTH * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (this.height - ITEMS_SPACE_LENGTH * this.numberOfRows) /
        this.numberOfRows;

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

GridLayoutPopUp.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
    }
    element.x = this.xOrigin + this.rowWidth / 2 +
        (this.rowWidth + ITEMS_SPACE_LENGTH) * this.currentColumn;
    var yCentered = (this.rowHeight / 2) - (element.height / 2);
    element.y = this.yOrigin + (this.rowHeight + ITEMS_SPACE_LENGTH) *
        this.currentRow + yCentered;

    this.addChild(element);
    this.currentColumn ++;
};

module.exports = GridLayoutPopUp;
