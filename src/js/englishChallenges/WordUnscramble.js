/**
 * Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

var FamilyEC = function(level) {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, level, 'father', 'Word Unscramble', 10,
        dimensions);
    this.level = level;

    var word = 'mother';
    var wordImage = this.level.game.make.sprite(0, 0, 'mother');

    var optionals = {numberOfColumns: word.length};
    var wordFieldAnswer = new GridLayoutPanel(this.level,
        'wordField', optionals);

    this.wordFieldLetters = new GridLayoutPanel(this.level,
        'wordField', optionals);
    this.source = this.wordFieldLetters;
    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = new GridLayoutPanel(this.level, 'letterShade');
        letterShade.code = '' + i;
        this.destinations.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = this.level.game.make.text(0, 0, word.charAt(i));
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

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(wordImage);
    this.addElement(wordFieldAnswer);
    this.addElement(this.wordFieldLetters);
    this.addElement(this.confirmButton);
};

FamilyEC.prototype = Object.create(DragAndDropChallenge.prototype);
FamilyEC.prototype.constructor = FamilyEC;

FamilyEC.prototype.bringItemToTop = function(item) {
    if (FamilyEC.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = FamilyEC;
