/**
 * @ignore Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var GridLayoutPanel = require('../util/GridLayoutPanel');

/**
 * Represents the EnglishChallenge in which player should match a word with its
 * corresponding image representation. This is a drag and drop challenge.
 * @class ImageWordMatch
 * @extends DragAndDropChallenge
 * @constructor
 */
var ImageWordMatch = function() {
    var dimensions = {numberOfRows: 3};
    DragAndDropChallenge.call(this,
        'imageWord',
        'Image Match',
        'Match the words \nwith their images',
        10,
        dimensions
    );
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

/**
 * Create a new challenge to the player.
 * @method ImageWordMatch.newChallenge
 */
ImageWordMatch.prototype.newChallenge = function() {
    this.clearChallenge();
    var words = level.myVocabulary.randomVocabularyItems(3);
    var wordCells = [];

    for (var i in words) {
        this.vocabularyItems.push(words[i]);
        var cell = new VerticalLayoutPanel('imageWordBg');
        var image = level.game.make.sprite(0, 0, words[i].key);
        var scaleX;
        var scaleY;
        if (image.height > 120 || image.width > 180) {
            scaleY = 120 / image.height;
            scaleX = 180 / image.width;
            if (scaleX > scaleY) {
                image.scale.x = scaleY;
                image.scale.y = scaleY;
            }else {
                image.scale.x = scaleX;
                image.scale.y = scaleX;
            }
        }
        var shade = new VerticalLayoutPanel('wordBg', 2);
        shade.code = i;

        this.destinations.push(shade);
        cell.addElement(image);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, words[i].name);
        //Font style
        label.font = level.font;
        label.fontSize = 20;
        label.fill = '#473e2c';
        label.stroke = '#fff';
        label.strokeThickness = 2;
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        //label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = i;

        wordCells.push(cell);
        this.elements.push(label);
    }

    var optionals = {numberOfColumns: this.elements.length};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    var images = new GridLayoutPanel('englishChallengePanelBg', optionals);

    var familyMemberCell;
    for (familyMemberCell in wordCells) {
        images.addElement(wordCells[familyMemberCell]);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(images);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ImageWordMatch.bringItemToTop
 * @param {Sprite} element - element that is being dragged by the player
 */
ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;
