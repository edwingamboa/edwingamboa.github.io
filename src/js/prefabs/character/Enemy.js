/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('../character/Character');

var Enemy = function(level,
                 spriteKey,
                 maxHealthLevel,
                 x,
                 y,
                 rangeDetection,
                 rangeAttack) {
    Character.call(this, level, x, y, spriteKey);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.healthLevelText = level.game.add.text(this.body.x, this.body.y - 20,
        '' + this.healthLevel, {fontSize: '12px', fill: '#000'});
    this.rangeDetection = rangeDetection;
    this.rangeAttack = rangeAttack;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.animations.play('right');

    }else if (this.body.velocity.x < 0) {
        this.animations.play('left');
    }
    this.healthLevelText.x = this.body.x;
    this.healthLevelText.y = this.body.y - 20;
    this.currentWeapon.updateCoordinates(this.x + 20, this.y + 20);
};

Enemy.prototype.updateHealhtLevel = function() {
    if (this.healthLevel > 0) {
        this.healthLevelText.text = '' + this.healthLevel;
    }else {
        this.healthLevelText.text = '';
        this.level.player.increaseScore(this.maxHealthLevel * 0.1);
    }
};

Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        this.level.game.physics.arcade.angleToXY(this, x, y);
};

module.exports = Enemy;
