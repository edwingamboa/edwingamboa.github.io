/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Weapon = function (game, player, numberOfBullets, imageName, nextFire, bulletSpeed, 
fireRate) {
    this.game = game;
    this.player = player;
    this.numberOfBullets = numberOfBullets; 
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(numberOfBullets, imageName);
    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('texture.baseTexture.scaleMode', PIXI.scaleModes.NEAREST);
    this.bullets.setAll('exists', false);  
};

Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function () {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.nextFire)
    {
        //  Grab the first bullet we can from the pool
        currentBullet = this.bullets.getFirstExists(false);

        if (currentBullet && this.numberOfBullets > 0)
        {
            //  And fire it
            currentBullet.reset(this.player.x, this.player.y+30);
            currentBullet.body.velocity.x = this.player.body.velocity.x + this.bulletSpeed*xDirection;
            this.nextFire = game.time.now + this.fireRate;
            //currentBullet.scale.set(this.scaleSize);
            //  Add and update the score
            this.numberOfBullets--;
            ammo = this.numberOfBullets;
            ammoText.text = 'Ammo: ' + ammo;
        }            
    }        
};