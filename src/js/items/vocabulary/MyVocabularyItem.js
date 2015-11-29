/**
 * Created by Edwin Gamboa on 29/11/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View an inventory item.
 * @class MyVocabularyItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 */
var MyVocabularyItem = function(item, parentView) {
    ItemGroupView.call(this, item.key + 'Icon', 'Show', parentView);

    this.item = item;
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

MyVocabularyItem.prototype = Object.create(ItemGroupView.prototype);
MyVocabularyItem.prototype.constructor = MyVocabularyItem;

/**
 * Allows the player to use this item.
 * @method MyVocabularyItem.buttonAction
 */
MyVocabularyItem.prototype.buttonAction = function() {
    this.item.use();
};

module.exports = MyVocabularyItem;
