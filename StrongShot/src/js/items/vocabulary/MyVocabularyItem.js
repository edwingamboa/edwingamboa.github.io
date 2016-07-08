/**
 * @ignore Created by Edwin Gamboa on 29/11/2015.
 */
var VerticalLayoutPanel = require('../../util/VerticalLayoutPanel');
var Button = require('../../util/Button');

/**
 * View an inventory item.
 * @class MyVocabularyItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 * @param {bool} learned - Indicates whether the player has learned the word or
 * not.
 */
var MyVocabularyItem = function(item, parentView, learned) {
    VerticalLayoutPanel.call(this, 'myVocabularyItemBg', 4);
    this.item = item;
    this.icon = level.game.make.sprite(0, 0, this.item.key);
    var scale = 45 / this.icon.height;
    this.icon.scale.x = scale;
    this.icon.scale.y = scale;
    this.title = level.game.make.text(0, 0, this.item.name);
    this.title.font = level.font;
    this.title.fontSize = 15;
    this.title.fill = '#473e2c';

    this.button = new Button('Show', this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addElement(this.button);
    this.parentView = parentView;
    this.learned = learned || false;
    if (this.learned) {
        this.addLearnedIcon();
    }
};

MyVocabularyItem.prototype = Object.create(VerticalLayoutPanel.prototype);
MyVocabularyItem.prototype.constructor = MyVocabularyItem;

/**
 * Allows the player to use this item.
 * @method MyVocabularyItem.buttonAction
 */
MyVocabularyItem.prototype.buttonAction = function() {
    this.item.show();
};

/**
 * Adds an icon to this view, that indicates that the player already learned,
 * learned the word.
 * @method MyVocabularyItem.addLearnedIcon
 */
MyVocabularyItem.prototype.addLearnedIcon = function() {
    var learnedIcon = level.game.make.sprite(this.width - 20, this.height / 2,
        'learned');
    learnedIcon.anchor.set(1, 0.8);
    this.addChild(learnedIcon);
};

module.exports = MyVocabularyItem;
