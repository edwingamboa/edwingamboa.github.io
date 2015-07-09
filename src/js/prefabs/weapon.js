var Weapon = function(game, player, numberOfBullets, imageKey, nextFire,
                      bulletSpeed, fireRate, power) {
    this.game = game;
    this.player = player;
    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(numberOfBullets, imageKey);
    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('texture.baseTexture.scaleMode',
        PIXI.scaleModes.NEAREST);
    this.bullets.setAll('exists', false);
};

Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(direction) {
    if (this.game.time.now > this.nextFire) {

        this.currentBullet = this.bullets.getFirstExists(false);

        if (this.currentBullet && this.numberOfBullets > 0) {
            this.currentBullet.reset(this.player.x, this.player.y + 30);
            this.currentBullet.body.velocity.x = this.player.body.velocity.x +
                    this.bulletSpeed * direction;
            this.nextFire = this.game.time.now + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

module.exports = Weapon;
