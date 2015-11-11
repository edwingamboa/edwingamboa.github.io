/**
 * Created by Edwin Gamboa on 05/11/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/ClueItem');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 6;
/**
 * Number of places form vocabulary for this level.
 * @type {number}
 */
var NUMBER_OF_PLACES = 4;

/**
 * Manages LevelTwo.
 * @class LevelTwo
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Pahser Game object.
 */
var LevelTwo = function(game) {
    Level.call(this, game);
};

LevelTwo.prototype = Object.create(Level.prototype);
LevelTwo.prototype.constructor = LevelTwo;

/**
 * Creates level one specific objects and elements.
 * @method LevelTwo.create
 */
LevelTwo.prototype.create = function() {
    Level.prototype.create.call(this);
    this.game.stage.backgroundColor = '#C2501B';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addPlaces();
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
    var heathPacksDistance = this.WORLD_WIDTH / 4;
    this.addHealthPack(new HealthPack(heathPacksDistance, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 2, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 3, 10, 5, this));
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelTwo.addObjects
 */
LevelTwo.prototype.addObjects = function() {
    var dialog = new VerticalLayoutPopUp('mediumPopUpBg', null, 'Necklace');
    var necklaceIcon = level.game.make.sprite(0, 0, 'necklaceBig');
    var message = 'That is my wife\'s necklace!';
    var dialogText = level.game.make.text(0, 0, message);
    dialogText.font = 'Arial';
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    dialog.addElement(necklaceIcon);
    dialog.addElement(dialogText);
    var necklace = new ClueItem(300, this.GROUND_HEIGHT - 30, 'necklace',
        dialog, 'Necklace', 'My wife\'s necklace.');
    this.addOtherItem(necklace);

    dialog = new Dialog('storeButton', 'Use the store to buy a weapon.');
    var gunsStore = new InteractiveHouse(5 * this.firstCheckPointX,
        this.GROUND_HEIGHT, 'redHouse', dialog);
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    this.addCar(3.7 * this.checkPointsDistance, 'bus');
};

/**
 * Adds level one non player characters.
 * @method LevelTwo.addNPCs
 */
LevelTwo.prototype.addNPCs = function() {
    var message = 'I know that you are looking for \nyour family.' +
        '\nI can help you.' +
        '\n\nGo to the blue house after the Zoo,' +
        '\nmaybe your family is there.';
    this.addNPC(this.game.camera.width / 2, 'npc', message);
};

/**
 * Adds this level enemies.
 * @method LevelTwo.addEnemies
 */
LevelTwo.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.75;
    this.addStrongestEnemy(this.WORLD_WIDTH - 100);
    var numberOfEnemies = 2;
    var numberOfStrongEnemies = 2;
    var i;
    var j;
    for (i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (j = 0; j < numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x);
        }
        for (j = 0; j < numberOfStrongEnemies; j++) {
            x += 50;
            this.addStrongEnemy(x);
        }
        numberOfEnemies ++;
        x += this.checkPointsDistance;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelTwo.addPlaces
 */
LevelTwo.prototype.addPlaces = function() {
    var housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse', 'orangeHouse'];
    var placesKeys = ['bank', 'coffeeShop', 'hospital', 'school'];
    var placesNames = ['Bank', 'Coffee Shop', 'Hospital', 'School'];
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
 * @method LevelTwo.nextLevel
 */
LevelTwo.prototype.nextLevel = function() {
    this.game.state.start('intro');
    //level = this.game.state.states.levelThree;
};

module.exports = LevelTwo;
