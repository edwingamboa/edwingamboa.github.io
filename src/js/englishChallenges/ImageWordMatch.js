/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var Button = require('../util/Button');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var GridLayoutPanel = require('../util/GridLayoutPanel');

/**
 * Represents the EnglishChallenge in which player should match a word with its
 * corresponding image representation. This is a drag and drop challenge.
 * @constructor
 */
var ImageWordMatch = function() {
    var dimensions = {numberOfRows: 3};
    DragAndDropChallenge.call(this, 'mother', 'Word-Image Match', 10,
        dimensions);
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

/**
 * Create a new challenge to the player.
 */
ImageWordMatch.prototype.newChallenge = function() {
    this.clearChallenge();
    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel('itemGroupBackGround');
        var familyMember = level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = level.game.make.sprite(0, 0, 'useButtonShade');
        shade.code = key;

        this.destinations.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        //label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = key;

        familyMembersCells.push(cell);
        this.elements.push(label);
    }

    var optionals = {numberOfColumns: this.elements.length};
    this.source = new GridLayoutPanel('wordField', optionals);

    var images = new GridLayoutPanel('wordField', optionals);

    var familyMemberCell;
    for (familyMemberCell in familyMembersCells) {
        images.addElement(familyMembersCells[familyMemberCell]);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();
    this.confirmButton = new Button('Confirm', this.confirm, this);

    this.addElement(images);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;
