/**
 * Created by Edwin Gamboa on 29/11/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var MyVocabularyItem = require ('./MyVocabularyItem');
var Utilities = require('../../util/Utilities');

/**
 * Ui and control for the game MyVocabulary.
 * @class MyVocabulary
 * @extends ItemsPopUp
 * @constructor
 */
var MyVocabulary = function() {
    this.categoriesLabels = ['Places', 'Family', 'Transport', 'Personal Items'];
    this.categories = ['places', 'family', 'transport', 'personalItems'];
    ItemsPopUp.call(this, this.categoriesLabels, this.categories,
        'Vocabulary');
};

MyVocabulary.prototype = Object.create(ItemsPopUp.prototype);
MyVocabulary.prototype.constructor = MyVocabulary;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method MyVocabulary.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
MyVocabulary.prototype.addItem = function(item) {
    this.items[this.categories[item.categoryIndex]].push(
        new MyVocabularyItem(item, this));
};

/**
 * Creates all items views.
 * @method MyVocabulary.createItemGroups
 */
MyVocabulary.prototype.createItemGroups = function() {};

/**
 * Returns an array with the desired number of words.
 * @method MyVocabulary.randomVocabularyItems
 * @param {number} numberOfWords - Desired number of words
 * @return {Array} - Array containing random words from the vocabulary.
 */
MyVocabulary.prototype.randomVocabularyItems = function(numberOfWords) {
    var util = new Utilities();
    var randomCategory = this.randomCategory(numberOfWords);
    var indexes = util.randomIndexesArray(this.items[randomCategory].length);
    var vocabularyItems = [];
    var i;
    for (i = 0; i < numberOfWords; i++) {
        vocabularyItems.push(this.items[randomCategory][indexes[i]].item);
    }
    return vocabularyItems;
};

/**
 * Returns a random category from the vocabulary, that has at least a certain
 * number of words.
 * @method MyVocabulary.randomCategory
 * @param numberOfWords - Minimum number of words that should have the category.
 * @returns {string} - a random category that has a certain number of words.
 */
MyVocabulary.prototype.randomCategory = function(numberOfWords) {
    var emptyCategory = true;
    var index;
    var category;
    while (emptyCategory) {
        index = level.game.rnd.integerInRange(0, this.categories.length - 1);
        category = this.categories[index];
        if (this.items[category].length >= numberOfWords) {
            emptyCategory = false;
        }
    }
    return category;
};

module.exports = MyVocabulary;
