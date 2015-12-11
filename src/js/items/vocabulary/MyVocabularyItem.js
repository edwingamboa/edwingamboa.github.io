/**
 * Created by Edwin Gamboa on 29/11/2015.
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
 */
var MyVocabularyItem = function(item, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBg', 2);
    this.item = item;
    this.icon = level.game.make.sprite(0, 0, this.item.key);
    var scale = 50 / this.icon.height;
    this.icon.scale.x = scale;
    this.icon.scale.y = scale;
    this.title = level.game.make.text(0, 0, this.item.name);
    this.title.font = 'Arial';
    this.title.fontSize = 20;
    this.title.fill = '#0040FF';

    this.button = new Button('Show', this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addElement(this.button);
    this.parentView = parentView;
};

MyVocabularyItem.prototype = Object.create(VerticalLayoutPanel.prototype);
MyVocabularyItem.prototype.constructor = MyVocabularyItem;

/**
 * Allows the player to use this item.
 * @method MyVocabularyItem.buttonAction
 */
MyVocabularyItem.prototype.buttonAction = function() {
    this.item.use();
};

module.exports = MyVocabularyItem;
