var Item = require('../Item');
var Bullet = require('../weapons/Bullet');

var Weapon = function(level,
                      x,
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
    Item.call(this, level, x, y, weaponKey, price);

    this.anchor.set(0.1, 0.5);

    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(level, power, bulletKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.level = level;
    this.infinite = infinite;
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(toX, toY) {
    if (this.level.game.time.now > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                this.level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, toY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = this.level.game.time.now + this.fireRate;
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
    this.level.player.useWeapon(this);
    this.level.updateAmmoText();
};

Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

module.exports = Weapon;
