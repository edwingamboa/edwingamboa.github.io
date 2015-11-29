/**
 * Created by Edwin Gamboa on 29/11/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var MyVocabularyItem = require ('./MyVocabularyItem');

/**
 * Ui and control for the game MyVocabulary.
 * @class MyVocabulary
 * @extends ItemsPopUp
 * @constructor
 */
var MyVocabulary = function() {
    var tabsLabels = ['Family', 'Places', 'Transport', 'Others'];
    var categories = ['family', 'places', 'transport', 'others'];
    ItemsPopUp.call(this, tabsLabels, categories, 'My Vocabulary');
};

MyVocabulary.prototype = Object.create(ItemsPopUp.prototype);
MyVocabulary.prototype.constructor = MyVocabulary;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method MyVocabulary.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
MyVocabulary.prototype.addItem = function(item) {
    this.items[item.category][item.key] = new MyVocabularyItem(item, this);
};

/**
 * Creates all items views.
 * @method MyVocabulary.createItemGroups
 */
MyVocabulary.prototype.createItemGroups = function() {};

module.exports = MyVocabulary;
