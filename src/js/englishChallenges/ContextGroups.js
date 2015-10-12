/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var NUMBER_OF_CONTEXTS = 2;
var ContextGroups = function(level) {
    this.score = 30;
    var dimensions = {numberOfColumns: 1, numberOfRows: 4};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var words = ['Mother', 'Son', 'Father', 'Living room', 'Dining room',
        'Kitchen'];

    this.contexts = [];
    var draggableWords = [];
    var optionals = {numberOfColumns: words.length / 2, numberOfRows : 2};
    this.wordsField = new GridLayoutPanel(this.level, 'wordField', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS};
    var contextsPanels = new GridLayoutPanel(this.level, 'wordField',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    this.numberOfWords = words.length / NUMBER_OF_CONTEXTS;
    optionals = {numberOfRows: this.numberOfWords};
    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new GridLayoutPanel(this.level, 'itemGroupBackGround',
            optionals);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = i * (NUMBER_OF_CONTEXTS + 1);
             j < (i + 1) * this.numberOfWords; j++) {
            word = this.level.game.make.text(0, 0, words[j]);
            //Font style
            word.font = 'Shojumaru';
            word.fontSize = 20;
            word.fill = '#0040FF';
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.fixLocation, this);
            word.code = '' + i;
            draggableWords.push(word);

            wordShade = new GridLayoutPanel(this.level, 'useButtonShade');
            context.addElement(wordShade);
        }
    }

    var randomIndex;
    var indexes = [];
    for (i = 0; i < draggableWords.length; i++) {
        indexes.push(i);
    }

    for (i = 0; i < draggableWords.length; i++) {
        randomIndex = level.game.rnd.integerInRange(0,
            indexes.length - 1);
        this.wordsField.addElement(draggableWords[indexes[randomIndex]]);
        draggableWords[indexes[randomIndex]].initialX =
            draggableWords[indexes[randomIndex]].x;
        draggableWords[indexes[randomIndex]].initialY =
            draggableWords[indexes[randomIndex]].y;
        indexes.splice(randomIndex, 1);
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    //this.addElement(Description);
    this.addElement(contextsPanels);
    this.addElement(this.wordsField);
    this.addElement(this.confirmButton);
};

ContextGroups.prototype = Object.create(GridLayoutPopUp.prototype);
ContextGroups.prototype.constructor = ContextGroups;

ContextGroups.prototype.fixLocation = function(item) {
    var context;
    var shade;
    for (context in this.contexts) {
        for (shade in this.contexts[context].children) {
            if (item.overlap(this.contexts[context].children[shade]) &&
                this.contexts[context].children[shade].children.length === 0) {
                item.x = 0;
                item.y = 0;
                this.contexts[context].children[shade].addChild (item);
                return;
            }
            item.x = item.initialX;
            item.y = item.initialY;
            this.wordsField.addChild(item);
        }
    }
};

ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

ContextGroups.prototype.confirm = function() {
    var correct = true;
    if (this.wordsField.children.length > 0) {
        this.level.showErrorMessage('The challenge is not complete.', this);
        return;
    }
    for (var shade in this.contexts) {
        for (var word in this.contexts[shade].children) {
            if (this.contexts[shade].children[word].children[0].code !==
                shade) {
                this.level.showErrorMessage('Sorry! Try Again.', this);
                return;
            }
        }
    }
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', this);
    this.close();
};

module.exports = ContextGroups;
