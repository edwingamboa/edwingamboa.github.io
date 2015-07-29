/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');

var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    this.addNPCs();
    this.addEnemies();
    this.addRevolver(2000, 400, false);
    this.addMachineGun(2400, 400, false);
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 350);
};

LevelOne.prototype.addEnemies = function() {
    var x = this.game.camera.width;
    var y = 350;
    for (var i = 0; i < 5; i++) {
        x += 30;
        this.addSimpleEnemy(x, y);
    }
    for (var j = 0; j < 2; j++) {
        x += 50;
        this.addStrongEnemy(x, y);
    }
};

module.exports = LevelOne;
