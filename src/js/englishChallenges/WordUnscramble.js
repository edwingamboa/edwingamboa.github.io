/**
 * Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

/**
 * Represents the EnglishChallenge in which player is presented with a set of
 * letters that should be correctly arranged in order to form a word.
 * @constructor
 */
var WordUnscramble = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'father', 'Word Unscramble', 10,
        dimensions);
};

WordUnscramble.prototype = Object.create(DragAndDropChallenge.prototype);
WordUnscramble.prototype.constructor = WordUnscramble;

/**
 * Create a new challenge to the player.
 */
WordUnscramble.prototype.newChallenge = function() {
    this.clearChallenge();
    var word = 'mother';
    var wordImage = level.game.make.sprite(0, 0, 'mother');

    var optionals = {numberOfColumns: word.length};
    var wordFieldAnswer = new GridLayoutPanel('wordField', optionals);

    this.source = new GridLayoutPanel('wordField', optionals);
    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = new GridLayoutPanel('letterShade');
        letterShade.code = '' + i;
        this.destinations.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = level.game.make.text(0, 0, word.charAt(i));
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

    this.confirmButton = new Button('Confirm', this.confirm, this);
    this.addElement(wordImage);
    this.addElement(wordFieldAnswer);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
WordUnscramble.prototype.bringItemToTop = function(item) {
    if (WordUnscramble.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = WordUnscramble;
