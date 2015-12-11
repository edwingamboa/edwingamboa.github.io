/**
 * Created by Edwin Gamboa on 08/10/2015.
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
    DragAndDropChallenge.call(this, 'imageWord', 'Image Match', 10,
        dimensions);
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
        var cell = new VerticalLayoutPanel('imageWordBg');
        var word = level.game.make.sprite(0, 0, words[i].key);
        if (word.height > 120) {
            var scale = 120 / word.height;
            word.scale.x = scale;
            word.scale.y = scale;
        }
        var shade = new VerticalLayoutPanel('wordBg', 2);
        shade.code = i;

        this.destinations.push(shade);
        cell.addElement(word);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, words[i].name);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
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
