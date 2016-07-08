/**
 * @ignore Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('./level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var TriggerSprite = require ('../../worldElements/TriggerSprite');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var InteractionManager = require('../../util/InteractionManager');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');
var NonPauseDialog = require('../../util/NonPauseDialog');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;

/**
 * Manages LevelOne.
 * @class LevelOne
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Pahser Game object.
 */
var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

/**
 * Creates level one specific objects and elements.
 * @method LevelOne.create
 */
LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    localStorage.setItem('level', 'levelOne');
    this.nextState = 'levelTwo';
    this.game.stage.backgroundColor = '#C7D2FC';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 3;
    this.numberOfStrongEnemies = 0;
    this.createPlaces();
    this.addInteractiveBuildings();
    this.addStaticBuildings();
    this.addNPCs();
    this.addEnemies();
    this.createWeapons();
    this.addClueItems();
    this.addLevelCar('jeep', 4.4 * this.checkPointsDistance);
    this.addHealthPacks();
    this.addTutorialInstructions();
};

/**
 * Add instructions to guide the player
 * @method LevelOne.addTutorialInstructions
 */
LevelOne.prototype.addTutorialInstructions = function() {
    var howToMoveDialog = new NonPauseDialog(50, 70, 'dialogBgSmall', null,
        '', 8, 'Move using arrow keys', 'arrowKeysMove', true, false);
    howToMoveDialog.open();

    var howToShoot = new NonPauseDialog(this.CAMERA_WIDTH - 100, 70,
        'dialogBgSmall', null, '', 8, 'Shoot using the Space Bar', 'spaceBar',
        true, false);
    var triggerHouse = new TriggerSprite(howToShoot.x, this.GROUND_HEIGHT,
        'greenHouse', howToShoot.open, howToShoot);
    this.addTriggerSprite(triggerHouse);

    var howToRun = new NonPauseDialog(this.CAMERA_WIDTH * 2.8, 70,
        'dialogBgSmall', null, '', 8, 'Run using X and arrow keys',
        'arrowKeysRun',
        true, false);
    triggerHouse = new TriggerSprite(howToRun.x, this.GROUND_HEIGHT,
        'whiteHouse', howToRun.open, howToRun);
    this.addTriggerSprite(triggerHouse);

    var howToJump = new NonPauseDialog(this.CAMERA_WIDTH * 4, 70,
        'dialogBgSmall', null, '', 8, 'Jump using Up key', 'arrowKeysJump',
        true, false);
    triggerHouse = new TriggerSprite(howToJump.x, this.GROUND_HEIGHT,
        'redHouse', howToJump.open, howToJump);
    this.addTriggerSprite(triggerHouse);

    //Car tutorial
    var animatedArrow = level.game.make.sprite(10, 0, 'arrowDown');
    animatedArrow.anchor.set(0, 1);
    animatedArrow.scale.x = 70 / animatedArrow.width;
    animatedArrow.scale.y = 60 / animatedArrow.height;
    animatedArrow.animations.add('animation', [0, 1, 2, 3, 4, 5], 4, true);
    animatedArrow.animations.play('animation');
    this.cars.children[0].getOnButton.addChild(animatedArrow);
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelOne.createWeapons
 */
LevelOne.prototype.createWeapons = function() {
    this.addRevolver(3000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Add ClueItems for this level.
 * @method LevelOne.addClueItems
 */
LevelOne.prototype.addClueItems = function() {
    var messages = ['Oh Great, those are my wife\'s glasses!'];
    var titles = ['My wife\'s glasses'];
    var imagesKeys = ['glasses'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'wife', false);
    vocabularyItems.push(vocabularyItem);
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(300, 'glasses', interactionManager);

    messages = ['Oh Great, that is my wife\'s watch!'];
    titles = ['My wife\'s watch'];
    imagesKeys = ['watch'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(this.WORLD_WIDTH / 1.5, 'watch', interactionManager);
};

/**
 * Adds interactive buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addInteractiveBuildings = function() {
    var messages = ['You can buy a weapon using the store'];
    var titles = ['Buying weapons'];
    var imagesKeys = ['store'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 1.55,
        this.GROUND_HEIGHT, 'store', interactionManager);
    interactiveHouse.createAnimatedArrow(-90,
        interactionManager.dialogs[0].height);
    this.addInteractiveHouse(interactiveHouse, true);

    messages = ['Your family is now somewhere else.',
        'Continue trying, because this game is just starting!'];
    titles = ['Continue trying', 'Continue trying'];
    imagesKeys = ['emptyRoom', 'emptyRoom'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'family', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 4.85,
        this.GROUND_HEIGHT, 'blueHouse', interactionManager);
    this.addInteractiveHouse(interactiveHouse, true);

    messages = ['You can add money playing the English Challenges'];
    titles = ['Add money'];
    imagesKeys = ['addCashBig'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 5.5,
        this.GROUND_HEIGHT, 'greenHouse', interactionManager);
    interactiveHouse.createAnimatedArrow(-10,
        interactionManager.dialogs[0].height);
    this.addInteractiveHouse(interactiveHouse, false);
};

/**
 * Adds static buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addStaticBuildings = function() {
    this.addStaticBuilding(5, 'orangeHouse');
    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var messages = [
        'Are you looking for Carlos? \n Be careful, he is so dangerous',
        'Your wife and children are in \nthe Big Blue House after the Zoo'
    ];
    var titles = ['I can help you', 'Go to Big Blue House'];
    var imagesKeys = ['npc', 'blueHouse'];
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    this.addNPC(this.game.camera.width / 2, 'npc', intManager);
};

/**
 * Creates the needed arrays to add this level places
 * @method LevelOne.createPlaces
 */
LevelOne.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    this.addPlaces();
};

module.exports = LevelOne;
