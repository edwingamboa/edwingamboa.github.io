var Item = require('../Item');
var Bullet = require('./Bullet');

var RIGHT_KEY = 0;
var LEFT_KEY = 1;

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
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

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

Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    level.player.useWeapon(this);
    level.updateAmmoText();
};

Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

Weapon.prototype.pointToRight = function() {
    this.frame = RIGHT_KEY;
};

Weapon.prototype.pointToLeft = function() {
    this.frame = LEFT_KEY;
};

module.exports = Weapon;
