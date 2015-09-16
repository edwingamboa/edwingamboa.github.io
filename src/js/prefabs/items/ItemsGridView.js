/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var NUMBER_OF_COLUMNS = 5;
var ITEMS_SPACE_LENGTH = 10;
var PopUp = require('../util/PopUp');
var ItemGroupView = require('../items/ItemGroupView');

var ItemsGridView = function(level, backgroundKey) {
    PopUp.call(this, level, backgroundKey);

    this.level = level;

    this.healthPacks = [];
    this.items = [];
    this.currentRow = 0;
    this.currentColumn = 0;
};

ItemsGridView.prototype = Object.create(PopUp.prototype);
ItemsGridView.prototype.constructor = ItemsGridView;

ItemsGridView.prototype.addItemGroup = function(itemGroup) {
    if (this.currentColumn >= NUMBER_OF_COLUMNS) {
        this.currentColumn = 0;
        this.currentRow++;
    }

    itemGroup.x = this.xOrigin + (itemGroup.width + ITEMS_SPACE_LENGTH) *
        this.currentColumn;
    itemGroup.y = this.yOrigin + (itemGroup.height + ITEMS_SPACE_LENGTH) *
        this.currentRow;

    this.addChild(itemGroup);
    this.currentColumn ++;
};

ItemsGridView.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = ItemsGridView;
