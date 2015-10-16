/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');

var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    this.firstCheckPointX = this.game.camera.width * 1.3;
    this.checkPointsDistance = this.game.camera.width + 140;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addRevolver(2000, 400, false);
    //this.player.bringToTop();
};

LevelOne.prototype.addObjects = function() {
    var gunsStore = new InteractiveHouse(
        this.firstCheckPointX + 1.5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    var friendsHouse = new InteractiveHouse(
        this.firstCheckPointX + 5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(this.firstCheckPointX + 3 * this.checkPointsDistance, 'jeep');
    //this.addCar(40, 'jeep');
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(this.firstCheckPointX + this.checkPointsDistance, 'friend',
        'comic2');
};

LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX;
    var y = 350;
    var numberOfEnemies = 3;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 30;
            this.addSimpleEnemy(x, y);
        }
        numberOfEnemies ++;
        x += 2 * this.checkPointsDistance;
    }
};

module.exports = LevelOne;
