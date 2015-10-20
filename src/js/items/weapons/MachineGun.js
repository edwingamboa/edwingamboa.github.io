/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

var MACHINE_GUN_NUMBER_OF_BULLETS = 30;
var MACHINE_GUN_KEY = 'machineGun';
var MACHINE_GUN_BULLET_KEY = 'bullet2';
var MACHINE_GUN_NEXT_FIRE = 1;
var MACHINE_GUN_BULLET_SPEED = 700;
var MACHINE_GUN_FIRE_RATE = 100;
var MACHINE_GUN_BULLET_POWER = 10;
var PRICE = 100;

var MachineGun = function(x, y, inifinite) {
    Weapon.call(
        this,
        x,
        y,
        MACHINE_GUN_NUMBER_OF_BULLETS,
        MACHINE_GUN_KEY,
        MACHINE_GUN_BULLET_KEY,
        MACHINE_GUN_NEXT_FIRE,
        MACHINE_GUN_BULLET_SPEED,
        MACHINE_GUN_FIRE_RATE,
        MACHINE_GUN_BULLET_POWER,
        inifinite,
        PRICE
    );
    this.name = 'Machine Gun';
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;
