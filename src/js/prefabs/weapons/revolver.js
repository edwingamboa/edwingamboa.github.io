/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('../weapons/Weapon');

var REVOLVER_NUMBER_OF_BULLETS = 10;
var REVOLVER_KEY = 'simpleWeapon';
var REVOLVER_BULLET_KEY = 'bullet1';
var REVOLVER_NEXT_FIRE = 10;
var REVOLVER_BULLET_SPEED = 700;
var REVOLVER_FIRE_RATE = 50;
var REVOLVER_BULLET_POWER = 5;

var Revolver = function(level, owner, x, y, inifinite) {
    Weapon.call(this,
        level,
        owner,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite
    );
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;
