/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var Button = require('../util/Button');

/**
 * View for an item in a menu of items.
 * @class ItemGroupView
 * @extends VerticalLayoutPanel
 * @constructor
 * @param {string} iconKey - Texture's key for the item icon.
 * @param {string} buttonText - Text to show on the action button.
 * @param {ItemsPopUp} parentView - View on which the ItemGroupView will be
 * displayed.
 */
var ItemGroupView = function(iconKey, buttonText, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBg', 2);

    this.icon = level.game.make.sprite(0, 0, iconKey);

    this.auxText = level.game.make.text(this.icon.width - 5, this.icon.height,
        '');
    this.auxText.font = 'Arial';
    this.auxText.fontSize = 20;
    this.auxText.fill = '#FFFF99';
    this.auxText.stroke = '#000000';
    this.auxText.strokeThickness = 2;
    this.auxText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 5);
    this.auxText.anchor.set(1, 0.8);

    this.icon.addChild(this.auxText);

    this.title = level.game.make.text(0, 0, 'Title');
    this.title.font = 'Arial';
    this.title.fontSize = 20;
    this.title.fill = '#0040FF';

    this.description = level.game.make.text(0, 0, 'Des 1 \n Des 2');
    this.description.font = 'Arial';
    this.description.fontSize = 12;
    this.description.fill = '#000000';

    this.button = new Button(buttonText, this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addElement(this.description);
    this.addElement(this.button);
    this.parentView = parentView;
};

ItemGroupView.prototype = Object.create(VerticalLayoutPanel.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

/**
 * Action to be performed when the button action is clicked.
 * @method ItemGroupView.buttonAction
 */
ItemGroupView.prototype.buttonAction = function() {};

/**
 * Sets the description text to be displayed to the player.
 * @method ItemGroupView.setDescription
 * @param {string} description - Text that describes the item.
 */
ItemGroupView.prototype.setDescription = function(description) {
    this.description.text = description;
    this.description.x = this.width / 2 - this.description.width / 2;
};

/**
 * Sets the items title to be displayed to the player.
 * @method ItemGroupView.setTitle
 * @param {string} title - Item title.
 */
ItemGroupView.prototype.setTitle = function(title) {
    this.title.text = title;
    this.title.x = this.width / 2 - this.title.width / 2;

};

/**
 * Sets the auxiliary or secondary text.
 * @method ItemGroupView.setAuxText
 * @param {string} auxText - Auxiliary or secondary text of this view.
 */
ItemGroupView.prototype.setAuxText = function(auxText) {
    this.auxText.text = auxText;
};

module.exports = ItemGroupView;
