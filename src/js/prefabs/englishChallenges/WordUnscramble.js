/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var GridPanel = require('../util/GridPanel');
var Button = require('../util/Button');

var FamilyEC = function(level) {
    this.score = 30;
    var dimensions = {numberOfColumns: 1, numberOfRows: 4};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var word = 'mother';
    this.shades = [];
    var letters = [];
    var wordImage = this.level.game.make.sprite(0, 0, 'mother');
    wordImage.anchor.set(0.5, 0);

    var optionals = {numberOfColumns: word.length};
    var wordFieldAnswer = new GridPanel(this.level, 'wordField', optionals);

    this.wordFieldLetters = new GridPanel(this.level, 'wordField', optionals);

    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = this.level.game.make.sprite(0, wordImage.height + 10,
            'letterShade');
        letterShade.anchor.set(0.5, 0);
        letterShade.code = i;
        this.shades.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = this.level.game.make.text(0, 0, word.charAt(i));
        //Font style
        letter.font = 'Shojumaru';
        letter.fontSize = 20;
        letter.fill = '#0040FF';
        letter.inputEnabled = true;
        letter.input.enableDrag(true, true);
        letter.events.onDragStop.add(this.fixLocation, this);
        letter.anchor.set(0.5, 0);
        letter.code = '' + i;
        letters.push(letter);
    }

    var randomIndex;
    var indexes = [];
    for (i = 0; i < word.length; i++) {
        indexes.push(i);
    }

    for (i = 0; i < word.length; i++) {
        randomIndex = level.game.rnd.integerInRange(0,
            indexes.length - 1);
        this.wordFieldLetters.addElement(letters[indexes[randomIndex]]);
        letters[indexes[randomIndex]].initialX =
            letters[indexes[randomIndex]].x;
        letters[indexes[randomIndex]].initialY =
            letters[indexes[randomIndex]].y;

        indexes.splice(randomIndex, 1);

    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(wordImage);
    this.addElement(wordFieldAnswer);
    this.addElement(this.wordFieldLetters);
    this.addElement(this.confirmButton);
};

FamilyEC.prototype = Object.create(GridLayoutPopUp.prototype);
FamilyEC.prototype.constructor = FamilyEC;

FamilyEC.prototype.fixLocation = function(item) {
    for (var shade in this.shades) {
        if (item.overlap(this.shades[shade]) &&
            this.shades[shade].children.length === 0) {
            item.x = 0;
            item.y = 0;
            this.shades[shade].addChild(item);
            return;
        }
        item.x = item.initialX;
        item.y = item.initialY;
        this.wordFieldLetters.addChild(item);
    }
};

FamilyEC.prototype.bringItemToTop = function(item) {
    if (FamilyEC.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

FamilyEC.prototype.confirm = function() {
    var correct = true;
    for (var shade in this.shades) {
        if (this.shades[shade].children[0] === undefined) {
            this.level.showErrorMessage('The challenge is not complete.', this);
            return;
        }
        var letter = this.shades[shade].children[0];
        if (this.shades[shade].children[0].code !== shade) {
            this.level.showErrorMessage('Sorry! Try Again.', this);
            return;
        }
    }
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', this);
    this.close();
};
module.exports = FamilyEC;
