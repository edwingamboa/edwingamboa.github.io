/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

var REVOLVER_NUMBER_OF_BULLETS = 20;
var REVOLVER_KEY = 'revolverSprite';
var REVOLVER_BULLET_KEY = 'bullet1';
var REVOLVER_NEXT_FIRE = 0;
var REVOLVER_BULLET_SPEED = 400;
var REVOLVER_FIRE_RATE = 250;
var REVOLVER_BULLET_POWER = 1;
var PRICE = 20;

var Revolver = function(level, x, y, inifinite) {
    Weapon.call(this,
        level,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite,
        PRICE
    );
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;
