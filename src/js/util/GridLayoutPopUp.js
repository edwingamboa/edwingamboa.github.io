/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var GridLayout = require('./GridLayout');

/**
 * Minimum number of columns for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_COLUMNS = 1;
/**
 * Minimum number of rows for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_ROWS = 1;

/**
 * Represents a PopUpLayout that contains a grid layout to arrange its elements.
 * @param backgroundKey {string} Texture's key of the background
 * @param title {string} Name or title of the PopUp
 * @param dimensions {Array} Array containing the number of rows and columns
 * @param parent {Sprite} View or Sprite that opened this PopUp
 * @constructor
 */
var GridLayoutPopUp = function(backgroundKey, title, dimensions, parent) {
    PopUp.call(this, backgroundKey, parent, title);
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || MIN_NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || MIN_NUMBER_OF_ROWS;
    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0,
        this.title.height, this);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

/**
 * Add an element to the container in the next possible cell of the grid.
 * @param element
 */
GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the PopUp
 */
GridLayoutPopUp.prototype.removeAllElements = function() {
    this.removeChildren(1);
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPopUp;
