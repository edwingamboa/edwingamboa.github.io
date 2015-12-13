/**
 * Created by Edwin Gamboa on 08/10/2015.
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
    DragAndDropChallenge.call(this, 'contexts', 'Contexts', 10,
        dimensions);
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
        level.myVocabulary.categories[wordsContext1[0].categoryIndex],
        level.myVocabulary.categories[wordsContext2[0].categoryIndex]
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
        contextTitle.font = 'Shojumaru';
        contextTitle.fontSize = 20;
        contextTitle.fill = '#0040FF';
        context.addElement(contextTitle);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = 0; j < numberOfWords; j++) {
            word = level.game.make.text(0, 0, vocabularyItems[i][j].name);
            //Font style
            word.font = 'Shojumaru';
            word.fontSize = 20;
            word.fill = '#0040FF';
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
