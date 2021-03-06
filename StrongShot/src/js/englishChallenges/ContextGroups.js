/**
 * @ignore Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');

/**
 * The number of contexts allowed for this challenge
 * @constant
 * @type {number}
 */
var NUMBER_OF_CONTEXTS = 2;

/**
 * Represents the EnglishChallenge in which the player should associate each
 * word to one context. This is a drag and drop kind of challenge.
 * @class ContextGroups
 * @extends DragAndDropChallenge
 * @constructor
 */
var ContextGroups = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this,
        'contexts',
        'Contexts',
        'Match the words \nwith their category',
        50,
        dimensions
    );
};

ContextGroups.prototype = Object.create(DragAndDropChallenge.prototype);
ContextGroups.prototype.constructor = ContextGroups;

/**
 * Create a new challenge to the player.
 * @method ContextGroups.newChallenge
 */
ContextGroups.prototype.newChallenge = function() {
    this.clearChallenge();
    var numberOfWords = 3;
    var vocabularyItems = [];
    var wordsContext1 = level.myVocabulary.randomVocabularyItems(numberOfWords);
    vocabularyItems.push(wordsContext1);
    var wordsContext2;
    do {
        wordsContext2 = level.myVocabulary.randomVocabularyItems(numberOfWords);
    }while (wordsContext1[0].categoryIndex == wordsContext2[0].categoryIndex);
    vocabularyItems.push(wordsContext2);

    var contextsNames = [
        level.myVocabulary.categoriesLabels[wordsContext1[0].categoryIndex],
        level.myVocabulary.categoriesLabels[wordsContext2[0].categoryIndex]
    ];

    this.contexts = [];
    var optionals = {numberOfColumns: numberOfWords, numberOfRows : 2,
        margin: 5};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS, margin: 0};
    var contextsPanels = new GridLayoutPanel('englishChallengePanelBg',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    var contextTitle;

    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new VerticalLayoutPanel('contextBg', 5);
        contextTitle = level.game.make.text(0, 0, contextsNames[i]);
        contextTitle.font = level.font;
        contextTitle.fontSize = 30;
        contextTitle.fill = '#f00000';
        contextTitle.stroke = '#000000';
        contextTitle.strokeThickness = 2;
        context.addElement(contextTitle);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = 0; j < numberOfWords; j++) {
            this.vocabularyItems.push(vocabularyItems[i][j]);
            word = level.game.make.text(0, 0, vocabularyItems[i][j].name);
            //Font style
            word.font = level.font;
            word.fontSize = 20;
            word.fill = '#473e2c';
            word.stroke = '#fff';
            word.strokeThickness = 2;
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.dragAndDropControl.fixLocation,
                this.dragAndDropControl);
            word.code = '' + i;
            this.elements.push(word);

            wordShade = new VerticalLayoutPanel('wordBg', 2);
            wordShade.code = '' + i;
            this.destinations.push(wordShade);
            context.addElement(wordShade);
        }
    }

    this.dragAndDropControl.addElementsToSourceRandomly();
    this.mainPanel.addElement(contextsPanels);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ContextGroups.bringItemToTop
 * @param {Phaser.Sprite} item - element that is being dragged by the player
 */
ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = ContextGroups;
