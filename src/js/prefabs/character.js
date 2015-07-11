/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character;
Character = function(level, x, y, spriteKey, speed, runningSpeed,
                      maxHealthLevel, bounce, gravity) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);
    this.speed = speed;
    this.runningSpeed = runningSpeed;
    this.healthLevel = maxHealthLevel;
    this.maxHealthLevel = maxHealthLevel;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    this.level = level;

    this.weapons = [];
    this.currentWeaponIndex = 0;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
};

Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    this.animations.play('right');
};

Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.runningSpeed;
    this.animations.play('left');
};

Character.prototype.runRight = function() {
    this.body.velocity.x = this.runningSpeed;
    this.animations.play('right');
};

Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 4;
};

Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

Character.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > this.maxHealthLevel) {
        this.healthLevel = this.maxHealthLevel;
    }
};

Character.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 0) {
        for (var i = 0; i < this.weapons.length; i++) {
            this.weapons[i].bullets.removeAll();
        }
        this.kill();
    }
};

Character.prototype.updateCurrentWeapon = function() {
    this.currentWeapon = this.weapons[this.currentWeaponIndex];
};

Character.prototype.nextWeapon = function() {
    this.currentWeaponIndex++;
    if (this.currentWeaponIndex === this.weapons.length) {
        this.currentWeaponIndex = 0;
    }
    this.currentWeapon = this.weapons[this.currentWeaponIndex];
};

module.exports = Character;
