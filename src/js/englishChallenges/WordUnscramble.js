/**
 * Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

/**
 * Represents the EnglishChallenge in which player is presented with a set of
 * letters that should be correctly arranged in order to form a word.
 * @class WordUnscramble
 * @extends DragAndDropChallenge
 * @constructor
 */
var WordUnscramble = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'unscramble', 'Unscrambler', 10,
        dimensions);
};

WordUnscramble.prototype = Object.create(DragAndDropChallenge.prototype);
WordUnscramble.prototype.constructor = WordUnscramble;

/**
 * Create a new challenge to the player.
 * @method WordUnscramble.newChallenge
 */
WordUnscramble.prototype.newChallenge = function() {
    this.clearChallenge();
    var word = level.myVocabulary.randomVocabularyItems(1)[0];
    var wordImage = level.game.make.sprite(0, 0, word.key);
    if (wordImage.height > 120) {
        var scale = 120 / wordImage.height;
        wordImage.scale.x = scale;
        wordImage.scale.y = scale;
    }

    var optionals = {numberOfColumns: word.name.length, margin: 5};
    var wordFieldAnswer = new GridLayoutPanel('lettersBg', optionals);

    this.source = new GridLayoutPanel('lettersBg', optionals);
    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.name.length; i++) {
        letterShade = new VerticalLayoutPanel('letterBg', 2);
        letterShade.code = '' + i;
        this.destinations.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = level.game.make.text(0, 0, word.name.charAt(i));
        //Font style
        letter.font = 'Shojumaru';
        letter.fontSize = 20;
        letter.fill = '#0040FF';
        letter.inputEnabled = true;
        letter.input.enableDrag(true, true);
        letter.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        letter.code = '' + i;
        this.elements.push(letter);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(wordImage);
    this.mainPanel.addElement(wordFieldAnswer);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method WordUnscramble.bringItemToTop
 * @param {Sprite} item - Element that is being dragged by the player.
 */
WordUnscramble.prototype.bringItemToTop = function(item) {
    if (WordUnscramble.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = WordUnscramble;
