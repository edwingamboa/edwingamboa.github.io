/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var Button = require('../util/Button');

var ItemGroupView = function(iconKey, buttonText, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBackGround', 2);

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

ItemGroupView.prototype.buttonAction = function() {};

ItemGroupView.prototype.setDescription = function(description) {
    this.description.text = description;
    this.description.x = this.width / 2 - this.description.width / 2;
};

ItemGroupView.prototype.setTitle = function(title) {
    this.title.text = title;
    this.title.x = this.width / 2 - this.title.width / 2;

};

ItemGroupView.prototype.setAuxText = function(auxText) {
    this.auxText.text = auxText;
};

module.exports = ItemGroupView;
