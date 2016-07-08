/**
 * @ignore Created by Edwin Gamboa on 17/07/2015.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var Button = require('../util/Button');

/**
 * View for an item in a menu of items.
 * @class ItemGroupView
 * @extends VerticalLayoutPanel
 * @constructor
 * @param {string} iconKey - Item's icon
 * @param {string} buttonText - Text to show on the action button.
 * @param {ItemsPopUp} parentView - View on which the ItemGroupView will be
 * displayed.
 */
var ItemGroupView = function(iconKey, buttonText, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBg', 2);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    if (this.icon.height > 50 || this.icon.width > 140) {
        var scaleY = 50 / this.icon.height;
        var scaleX = 140 / this.icon.width;
        if (scaleX > scaleY) {
            this.icon.scale.x = scaleY;
            this.icon.scale.y = scaleY;
        }else {
            this.icon.scale.x = scaleX;
            this.icon.scale.y = scaleX;
        }
    }

    this.auxText = level.game.make.text(this.width - 20, this.height / 2 - 20,
        '');
    this.auxText.font = level.font;
    this.auxText.fontSize = 20;
    this.auxText.fill = '#FFF12B';
    this.auxText.stroke = '#7d655f';
    this.auxText.strokeThickness = 2;
    this.auxText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 5);
    this.auxText.anchor.set(1, 0.8);

    this.title = level.game.make.text(0, 0, 'Title');
    this.title.font = level.font;
    this.title.fontSize = 20;
    this.title.fill = '#473e2c';

    this.description = level.game.make.text(0, 0, 'Des 1 \n Des 2');
    this.description.font = level.font;
    this.description.fontSize = 12;
    this.description.fill = '#000000';
    this.description.align = 'center';

    this.button = new Button(buttonText, this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addChild(this.auxText);
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
