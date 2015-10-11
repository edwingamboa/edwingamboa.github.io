/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayout = require('../util/GridLayout');

var NUMBER_OF_COLUMNS = 1;
var NUMBER_OF_ROWS = 1;

var GridLayoutPanel = function(level, backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.level = level;
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

module.exports = GridLayoutPanel;
