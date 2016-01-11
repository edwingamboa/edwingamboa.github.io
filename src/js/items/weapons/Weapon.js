var Item = require('../Item');
var Bullet = require('./Bullet');

/**
 * The key of the frame to be displayed when weapon should point to right.
 * @constant
 * @type {number}
 */
var RIGHT_KEY = 0;
/**
 * The key of the frame to be displayed when weapon should point to left.
 * @constant
 * @type {number}
 */
var LEFT_KEY = 1;

/**
 * Represents a game weapon for characters.
 * @class Weapon
 * @extends Item
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {number} numberOfBullets - Number of bullets for this weapon.
 * @param {string} weaponKey - Texture's key for this weapon.
 * @param {string} bulletKey - Texture's key for this weapon bullets.
 * @param {number} nextFire - The time player is allowed to shoot again.
 * @param {number} bulletSpeed - This weapon bullets' speed
 * @param {number} fireRate - Rate at which this weapon fires, the lower the
 * number, the higher the firing rate.
 * @param {number} power - Damage that can cause this weapon bullets.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 * @param {number} price - The price that this weapon costs.
 */
var Weapon = function(x,
                      y,
                      numberOfBullets,
                      weaponKey,
                      bulletKey,
                      nextFire,
                      bulletSpeed,
                      fireRate,
                      power,
                      infinite,
                      price) {
    Item.call(this, x, y, weaponKey, price);

    this.anchor.set(0.5, 0);

    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(power, bulletKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.infinite = infinite;
    this.description = 'Damage: ' + this.power +
        '\nAmmunition: ' + this.numberOfBullets;
    this.category = 'weapons';
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

/**
 * Allows the character to shoot or fire this weapon
 * @method Weapon.fire
 * @param {number} toX - X coordinate of the point to fire to.
 * @param {number} toY - Y coordinate of the point to fire to.
 */
Weapon.prototype.fire = function(toX, toY) {
    var finalToY = toY || this.y;
    if (level.game.time.time > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, finalToY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = level.game.time.time + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

/**
 * Relocates this weapon within the game world.
 * @method Weapon.updateCoordinates
 * @param {number} x - X coordinate of the new position.
 * @param {number} y - Y  coordinate of the new position.
 */
Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Allows the character to use this weapon.
 * @method Weapon.use
 */
Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    level.player.useWeapon(this);
    level.updateAmmoText();
};

/**
 * Add bullets to the weapon.
 * @method Weapon.addBullets
 * @param {number} amount - Number of bullets to be added.
 */
Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

/**
 * Kills this weapon so that it is not more accessible within the game.
 * @method Weapon.killWeapon
 */
Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

/**
 * Points the weapon to the right.
 * @method Weapon.pointToRight
 */
Weapon.prototype.pointToRight = function() {
    this.frame = RIGHT_KEY;
};

/**
 * Points the weapon to the left.
 * @method Weapon.pointToLeft
 */
Weapon.prototype.pointToLeft = function() {
    this.frame = LEFT_KEY;
};

/**
 * Saves this weapon information.
 * @method Weapon.saveWeapon
 */
Weapon.prototype.saveWeapon = function() {
    localStorage.setItem(this.key, this.numberOfBullets);
};

module.exports = Weapon;
