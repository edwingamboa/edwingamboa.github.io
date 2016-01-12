/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
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
 * @class GridLayoutPopUp
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Texture's key of the background
 * @param {string} title - Name or title of the PopUp.
 * @param {Object} [dimensions.numberOfColumns] - Number of columns for the
 * PopUp.
 * @param {Object} [dimensions.numberOfRows] - Number of rows for the PopUp.
 * @param {Phaser.Sprite} parent - View or Sprite that opened this PopUp.
 */
var GridLayoutPopUp = function(backgroundKey, title, dimensions, parent) {
    PopUp.call(this, backgroundKey, parent, title);
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || MIN_NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || MIN_NUMBER_OF_ROWS;
    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0,
        this.title.height + this.title.y, this, dims.margin);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

/**
 * Add an element to the container in the next possible cell of the grid.
 * @method GridLayoutPopUp.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method GridLayoutPopUp.restartPositions
 */
GridLayoutPopUp.prototype.restartPositions = function() {
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPopUp;
