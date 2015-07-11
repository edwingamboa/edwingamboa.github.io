var Bullet = require('../prefabs/bullet');
var Weapon;
Weapon = function(level, numberOfBullets, imageKey, nextFire, bulletSpeed,
                   fireRate, power, infinite) {
    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(level, power, imageKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.level = level;
    this.infinite = infinite;
};

Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(from, toX, toY) {
    if (this.level.game.time.now > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(from.x, from.y + 30);
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

module.exports = Weapon;
