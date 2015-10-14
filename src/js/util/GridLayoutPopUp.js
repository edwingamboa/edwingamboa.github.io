/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var GridLayout = require('./GridLayout');

var NUMBER_OF_COLUMNS = 1;
var NUMBER_OF_ROWS = 1;

var GridLayoutPopUp = function(level, backgroundKey, dimensions, parent) {
    PopUp.call(this, level, backgroundKey, parent);
    this.level = level;
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

module.exports = GridLayoutPopUp;
