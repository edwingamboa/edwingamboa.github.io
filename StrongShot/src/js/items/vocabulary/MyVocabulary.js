/**
 * @ignore Created by Edwin Gamboa on 29/11/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var MyVocabularyItem = require ('./MyVocabularyItem');
var Utilities = require('../../util/Utilities');
var VocabularyItem = require('../vocabularyItems/VocabularyItem');

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
        'Vocabulary', 5, 3);
    this.loadVocabulary();
};

MyVocabulary.prototype = Object.create(ItemsPopUp.prototype);
MyVocabulary.prototype.constructor = MyVocabulary;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method MyVocabulary.addItem
 * @param {Item} item - Item to be added to the vocabulary.
 */
MyVocabulary.prototype.addItem = function(item) {
    var category = this.categories[item.categoryIndex];
    if (this.items[category][item.key] === undefined) {
        this.items[category][item.key] = new MyVocabularyItem(item, this);
        this.items[category].length ++;
        localStorage.setItem(item.key + 'Voc', 0);
    }
};

/**
 * Loads an item to the inventory to be displayed for the player.
 * @method Inventory.loadItem
 * @param {Item} item - Item to be loaded to the vocabulary.
 * @param {bool} learned - Indicates whether the player has learned the word or
 * not.
 */
MyVocabulary.prototype.loadItem = function(item, learned) {
    var category = this.categories[item.categoryIndex];
    this.items[category][item.key] = new MyVocabularyItem(item, this, learned);
    this.items[category].length ++;
};

/**
 * Marks a vocabulary item as learned.
 * @method MyVocabulary.markAsLearned
 * @param {VocabularyItem} item - VocabularyItem's key
 */
MyVocabulary.prototype.markAsLearned = function(item) {
    var category = this.categories[item.categoryIndex];
    this.items[category][item.key].addLearnedIcon();
    localStorage.setItem(item.key + 'Voc', 1);
};

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
    var key;
    var j;
    for (i = 0; i < numberOfWords; i++) {
        j = 0;
        for (key in this.items[randomCategory]) {
            if (j === indexes[i]) {
                vocabularyItems.push(this.items[randomCategory][key].item);
                break;
            }else {
                j ++;
            }
        }
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

/**
 * Loads the player's vocabulary.
 * @method Store.createItemGroups
 */
MyVocabulary.prototype.loadVocabulary = function() {
    var keys = ['factory', 'school', 'hospital', 'coffeeShop', 'bank', 'zoo',
        'gasStation', 'playground', 'bookStore', 'hotel', 'superMarket',
        'fireStation', 'policeStation', 'blueHouse', 'store', 'child',
        'daughter', 'family', 'father', 'friend', 'husband', 'kid', 'mother',
        'parent', 'son', 'wife', 'car', 'jeep', 'bus', 'truck', 'taxi',
        'ambulance', 'bracelet', 'cap', 'ring', 'necklace', 'watch', 'glasses'];
    var i;
    var item;
    var learned;
    for (i in keys) {
        if (localStorage.getItem(keys[i] + 'Voc') !== null) {
            learned = false;
            item = new VocabularyItem(0, 0, keys[i]);
            if (parseInt(localStorage.getItem(keys[i] + 'Voc')) === 1) {
                learned = true;
            }
            this.loadItem(item, learned);
        }
    }
};

module.exports = MyVocabulary;
