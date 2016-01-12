/**
 * @ignore Created by Edwin Gamboa on 19/11/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var Wife = require('../../character/Wife');
var Friend = require('../../character/Friend');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');
var InteractionManager = require('../../util/InteractionManager');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 8;

/**
 * Manages LevelThree.
 * @class LevelThree
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelThree = function(game) {
    Level.call(this, game);
};

LevelThree.prototype = Object.create(Level.prototype);
LevelThree.prototype.constructor = LevelThree;

/**
 * Creates level one specific objects and elements.
 * @method LevelThree.create
 */
LevelThree.prototype.create = function() {
    Level.prototype.create.call(this);
    localStorage.setItem('level', 'levelThree');
    this.nextState = 'menu';
    this.game.stage.backgroundColor = '#09061F';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 2;
    this.numberOfStrongEnemies = 3;
    this.createPlaces();
    this.addStaticBuildings();
    this.addEnemies();
    this.addWife();
    this.addFriend(this.WORLD_WIDTH - 100);
    this.addClueItems();
    this.createWeapons();
    this.addHealthPacks();
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelThree.createWeapons
 */
LevelThree.prototype.createWeapons = function() {
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Creates the needed arrays to add this level places
 */
LevelThree.prototype.createPlaces = function() {
    this.housesKeys = ['yellowHouse', 'greenHouse', 'orangeHouse',
        'whiteHouse'];
    this.placesKeys = ['policeStation', 'fireStation', 'superMarket', 'hotel'];
    this.addPlaces();
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelThree.addClueItems
 */
LevelThree.prototype.addClueItems = function() {
    var messages = ['Our daughter\'s drawing!'];
    var titles = ['We are closer to our kids!'];
    var imagesKeys = ['family'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'kid', false);
    vocabularyItems.push(vocabularyItem);
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(300, 'family', interactionManager);

    messages = ['Oh Great, that is our son\'s cap!'];
    titles = ['Our son\'s cap'];
    imagesKeys = ['cap'];
    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'son', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(this.WORLD_WIDTH / 2 - 400, 'cap',
        interactionManager);

    messages = ['Oh Great, that is our daughter\'s bracelet!'];
    titles = ['My wife\'s bracelet'];
    imagesKeys = ['bracelet'];
    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'daughter', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(this.WORLD_WIDTH / 2 + 400, 'bracelet',
        interactionManager);
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.addWife
 */
LevelThree.prototype.addWife = function() {
    this.wife = new Wife(this.player.x - this.player.width,
        this.GROUND_HEIGHT - 50);
    this.addPlayerCharacter(this.wife);
};

/**
 * Adds the Friend (as Enemy) to enemies group.
 * @method LevelThree.addFriend
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
LevelThree.prototype.addFriend = function(x) {
    this.enemies.add(new Friend(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds static buildings to this level.
 * @method LevelThree.addInteractiveBuildings
 */
LevelThree.prototype.addStaticBuildings = function() {
    var house = this.addStaticBuilding(400, 'redHouse');
    this.addNeighbors(house, 'whiteHouse', 'blueHouse');
    this.addStaticBuilding(this.WORLD_WIDTH - 300, 'whiteHouse');
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.liberateFamilyMember
 */
LevelThree.prototype.liberateFamilyMember = function() {
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'parent', false);
    vocabularyItems.push(vocabularyItem);
    var messages = ['Thank you dear parents.'];
    var titles = ['Thank you!'];
    var imagesKeys = ['parent'];
    var intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.son = this.addNPC(
        this.WORLD_WIDTH - 250,
        'son',
        intManager
    );

    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'mother', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'father', false);
    vocabularyItems.push(vocabularyItem);
    messages = ['Mother and Father we are so happy to see you again.'];
    titles = ['Thank you!'];
    imagesKeys = ['parent'];
    intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.son = this.addNPC(
        this.WORLD_WIDTH - 200,
        'daughter',
        intManager
    );
};

module.exports = LevelThree;
