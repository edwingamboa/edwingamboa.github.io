var Bullet = require('../prefabs/bullet');
var Weapon;
Weapon = function(level, owner, numberOfBullets, weaponKey, bulletKey, nextFire,
                  bulletSpeed, fireRate, power, infinite) {
    Phaser.Sprite.call(this, level.game, owner.x , owner.y, weaponKey);

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
    this.owner = owner;
};

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function() {
    if (this.level.game.time.now > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                this.level.game.physics.arcade.angleToXY(this.currentBullet,
                this.owner.target.x, this.owner.target.y);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = this.level.game.time.now + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

Weapon.prototype.update = function() {
    this.x = this.owner.x;
    this.y = this.owner.y;
};

module.exports = Weapon;
