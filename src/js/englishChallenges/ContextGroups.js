/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

/**
 * The number of contexts allowed for this challenge
 * @constant
 * @type {number}
 */
var NUMBER_OF_CONTEXTS = 2;

/**
 * Represents the EnglishChallenge in which the player should associate each
 * word to one context. This is a drag and drop kind of challenge.
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
 */
ContextGroups.prototype.newChallenge = function() {
    this.clearChallenge();

    var words = ['Mother', 'Son', 'Father', 'Living room', 'Dining room',
        'Kitchen'];

    this.contexts = [];
    var optionals = {numberOfColumns: words.length / 2, numberOfRows : 2};
    this.source = new GridLayoutPanel('wordField', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS};
    var contextsPanels = new GridLayoutPanel('wordField',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    this.numberOfWords = words.length / NUMBER_OF_CONTEXTS;
    optionals = {numberOfRows: this.numberOfWords};
    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new GridLayoutPanel('itemGroupBackGround',
            optionals);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = i * (NUMBER_OF_CONTEXTS + 1);
             j < (i + 1) * this.numberOfWords; j++) {
            word = level.game.make.text(0, 0, words[j]);
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

            wordShade = new GridLayoutPanel('useButtonShade');
            wordShade.code = '' + i;
            this.destinations.push(wordShade);
            context.addElement(wordShade);
        }
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.confirmButton = new Button('Confirm', this.confirm, this);
    //this.addElement(Description);
    this.addElement(contextsPanels);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = ContextGroups;
