/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;
/**
 * Number of places form vocabulary for this level.
 * @type {number}
 */
var NUMBER_OF_PLACES = 4;
/**
 * Number of houses player should visit during this level.
 * @type {number}
 */
var NUMBER_OF_HOUSES = 2;

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
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addPlaces();
    this.addRevolver(3000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    var heathPacksDistance = this.WORLD_WIDTH / 4;
    this.addHealthPack(new HealthPack(heathPacksDistance, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 2, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 3, 10, 5, this));
};

/**
 * Add InteractiveCar and InteractiveHouses for this level.
 * @method LevelOne.addObjects
 */
LevelOne.prototype.addObjects = function() {
    var playerHouse = this.addStaticBuilding(5, 'orangeHouse');

    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');

    var dialog = new Dialog('storeButton', 'Use the store to buy a weapon.');
    var gunsStore = new InteractiveHouse(this.firstCheckPointX * 1.4,
        this.GROUND_HEIGHT, 'redHouse', dialog);
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    dialog = new VerticalLayoutPopUp('mediumPopUpBg', null, 'So late!');
    var emptyRoom = level.game.make.sprite(0, 0, 'emptyRoom');
    var finishMessage = 'Your family is now somewhere else.' +
        '\nContinue trying, because this game is just starting!';
    var dialogText = level.game.make.text(0, 0, finishMessage);
    dialogText.font = 'Arial';
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    dialog.addElement(emptyRoom);
    dialog.addElement(dialogText);

    var friendsHouse = new InteractiveHouse(5 * this.checkPointsDistance,
        this.GROUND_HEIGHT, 'blueHouse', dialog);
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);
    this.addNeighbors(friendsHouse, 'orangeHouse', 'yellowHouse');

    this.addCar(3.7 * this.checkPointsDistance, 'jeep');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var message = 'I know that you are looking for \nyour family.' +
        '\nI can help you.' +
        '\n\nGo to the blue house after the Zoo,' +
        '\nmaybe your family is there.';
    this.addNPC(this.game.camera.width / 2, 'npc', message);
    message = 'Hi my friend!.' +
        '\n\nGo to the red House before the' +
        '\nPlayground, \nthere you can buy a new weapon.';
    this.addNPC(this.firstCheckPointX * 1.2, 'friend', message);
};

/**
 * Adds this level enemies.
 * @method LevelOne.addEnemies
 */
LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.75;
    var numberOfEnemies = 3;
    for (var i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x);
        }
        numberOfEnemies ++;
        x += this.checkPointsDistance;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelOne.addPlaces
 */
LevelOne.prototype.addPlaces = function() {
    var housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse', 'orangeHouse'];
    var placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    var placesNames = ['Book Store', 'Playground', 'Gas Station', 'Zoo'];
    var x = level.WORLD_WIDTH / (NUMBER_OF_PLACES + 2);
    var i;
    var houseIndex = 0;
    var place;
    var leftHouse;
    for (i = 0; i < placesKeys.length; i++) {
        if (houseIndex >= housesKeys.length) {
            houseIndex = 0;
        }
        place = this.addStaticBuilding(x * (i + 1), placesKeys[i]);
        this.addNeighbors(place, housesKeys[houseIndex],
            housesKeys[houseIndex + 1]);

        houseIndex += 2;
        this.addNameBoard(place.x - 60, placesNames[i] + ' Street');
    }
};

/**
 * Lets the player to play second level.
 * @method LevelOne.nextLevel
 */
LevelOne.prototype.nextLevel = function() {
    this.game.state.start('levelTwo');
    level = this.game.state.states.levelTwo;
};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
LevelOne.prototype.playerWins = function() {
    return this.player.x >= (this.WORLD_WIDTH - this.player.width);
};

module.exports = LevelOne;
