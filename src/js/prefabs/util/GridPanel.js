/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var NUMBER_OF_COLUMNS = 1;
var NUMBER_OF_ROWS = 1;
var MARGIN = 10;

var GridPanel = function(level, backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.anchor.set(0.5, 0.5);
    this.level = level;
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;
    this.rowWidth = (this.width - MARGIN * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (this.height - MARGIN * this.numberOfRows) /
        this.numberOfRows;
    this.xOrigin = -this.width / 2 + MARGIN;
    this.yOrigin = -this.height / 2 + MARGIN;
};

GridPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridPanel.prototype.constructor = GridPanel;

GridPanel.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
    }
    element.x = this.xOrigin + this.rowWidth / 2 +
        (this.rowWidth + MARGIN) * this.currentColumn;
    var yCentered = (this.rowHeight / 2) - (element.height / 2);
    element.y = this.yOrigin + (this.rowHeight + MARGIN) *
        this.currentRow + yCentered;

    this.addChild(element);
    this.currentColumn ++;
};

module.exports = GridPanel;
