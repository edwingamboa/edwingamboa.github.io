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
    var letterText;
    var letterShade;
    var code;
    for (i = 0; i < word.name.length; i++) {
        letter = word.name.charAt(i);
        code = letter.toLowerCase().charCodeAt(0);

        letterText = level.game.make.text(0, 0, letter);
        letterText.code = code;
        if(letter === ' ') {
            letterShade = new VerticalLayoutPanel('spaceBg', 2);
            letterShade.addElement(letterText);
        }else{
            letterShade = new VerticalLayoutPanel('letterBg', 2);
            //Font style
            letterText.font = 'Shojumaru';
            letterText.fontSize = 20;
            letterText.fill = '#0040FF';
            letterText.inputEnabled = true;
            letterText.input.enableDrag(true, true);
            letterText.events.onDragStop.add(
                this.dragAndDropControl.fixLocation,
                this.dragAndDropControl
            );
            this.elements.push(letterText);
        }
        letterShade.code = code;
        this.destinations.push(letterShade);
        wordFieldAnswer.addElement(letterShade);
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
