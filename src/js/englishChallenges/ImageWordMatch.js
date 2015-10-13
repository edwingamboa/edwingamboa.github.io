/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var Button = require('../util/Button');
var Utilities = require('../util/Utilities');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');

var ImageWordMatch = function(level) {
    var dimensions = {numberOfColumns: 3, numberOfRows: 3};
    DragAndDropChallenge.call(this, level, 'mother', 'Word-Image Match', 10,
        dimensions);

    var utils = new Utilities(level);

    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];
    var familyMembersLabels = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel(this.level, 'itemGroupBackGround');
        var familyMember = this.level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = this.level.game.make.sprite(0, 0, 'useButtonShade');
        shade.code = key;

        this.destinations.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = this.level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = key;
        label.source = this;

        familyMembersCells.push(cell);
        familyMembersLabels.push(label);
    }

    for (var familyMemberCell in familyMembersCells) {
        this.addElement(familyMembersCells[familyMemberCell]);
    }

    var randomIndexes = utils.randomIndexesArray(familyMembersLabels.length);
    var index;
    for (index in randomIndexes) {
        this.addElement(familyMembersLabels[randomIndexes[index]]);
        familyMembersLabels[randomIndexes[index]].sourceX =
            familyMembersLabels[randomIndexes[index]].x;
        familyMembersLabels[randomIndexes[index]].sourceY =
            familyMembersLabels[randomIndexes[index]].y;
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;
