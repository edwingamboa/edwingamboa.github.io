/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var SPEED = 250;
var MAX_SPEED = 300;
var GRAVITY = 300;
var Character = require('../character/Character');

var MINIMUM_SCORE = 10;
var Player;
Player = function(level) {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, level, 32, level.game.world.height - 150,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.score = MINIMUM_SCORE;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.jump = function() {
    this.body.velocity.y = -350;
};

Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    this.level.updateScoreText();
};

Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    this.level.updateScoreText();
};

Player.prototype.updateHealhtLevelText = function() {
    this.level.updateHealthLevelText();
};

Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.rotation =
            this.level.game.physics.arcade.angleToPointer(this);
        this.currentWeapon.updateCoordinates(this.x, this.y - 10);
    }
};

Player.prototype.killCharacter = function() {

    Character.prototype.killCharacter.call(this);
};

Player.prototype.pickUpWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

Player.prototype.changeSpeed = function(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
};

Player.prototype.resetSpeed = function() {
    this.speed = SPEED;
    this.maxSpeed = MAX_SPEED;
};

Player.prototype.changeGravity = function(gravity) {
    this.body.gravity.y = gravity;
};

Player.prototype.resetGravity = function() {
    this.body.gravity.y = GRAVITY;
};

module.exports = Player;
