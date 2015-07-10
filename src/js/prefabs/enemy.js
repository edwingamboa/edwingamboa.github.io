/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('../prefabs/character');

var Enemy;
Enemy = function(level, spriteKey, maxHealthLevel, x, y) {
    Character.call(this, level, x, y, spriteKey, 250,
        500, maxHealthLevel, 0.2, 300);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.healthLevelText = level.game.add.text(this.body.x, this.body.y - 20,
        '' + this.healthLevel, {fontSize: '12px', fill: '#000'});
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    this.healthLevelText.x = this.body.x;
    this.healthLevelText.y = this.body.y - 20;
};

Enemy.prototype.updateHealhtLevel = function() {
    if (this.healthLevel > 0) {
        this.healthLevelText.text = '' + this.healthLevel;
    }else {
        this.healthLevelText.text = '';
    }
};

module.exports = Enemy;
