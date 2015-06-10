/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {preload: preload, 
    create: create, update: update, render: render});

function preload() {

    game.load.image('sky', 'assets/images/sky.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.spritesheet('character', 'assets/sprites/character.png', 32, 48);
    for (var i = 1; i <= 2; i++)
    {
        game.load.image('bullet' + i, 'assets/images/bullet' + i + '.png');
    }
    game.stage.backgroundColor = '#82CAFA';

}

var player;
var platforms;
var cursors;

var playerVelocity = 250;
var playerAcceleration = 500;

var stars;
var score = 0;
var ammo = 10;
var healthLevel = 100;
var scoreText;
var ammoText;
var healthLevelText;


var weapons = [];
var currentWeapon = 0;

var xDirection = 1;

function create() {
    
    game.world.setBounds(0, 0, 3000, 600);
           
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    weapons.push(new Weapon(30, 'bullet1', 0, 400, 100));
    weapons.push(new Weapon(40, 'bullet2', 0, 500, 100));
    
    currentWeapon = 0;
    
    for (var i = 1; i < weapons.length; i++)
    {
       weapons[i].visible = false;
    }
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(10, 2);
    
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    
    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'character');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(game.camera.width - 300, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    scoreText.fixedToCamera = true;
    
    //  The ammo
    ammoText = game.add.text(game.camera.width - 300, game.world.height - 50, 'Ammo: 0', {fontSize: '32px', fill: '#000'});
    ammoText.fixedToCamera = true;
   
   //  The health level
    healthLevelText = game.add.text(16, 16, 'Health: 100', {fontSize: '32px', fill: '#000'});
    healthLevelText.fixedToCamera = true;
    
    

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
    var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    changeKey.onDown.add(nextWeapon, this);
    
    //To make camera follow the player
    game.renderer.renderSession.roundPixels = true;
    game.camera.follow(player);   
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        xDirection = -1;
        if (game.input.keyboard.isDown(Phaser.Keyboard.X))
        {
            player.body.velocity.x = -playerAcceleration;
        }else{
            //  Move to the left
            player.body.velocity.x = -playerVelocity;
        }        
        

        player.animations.play('left');
        //game.camera.x -= 2;
    }
    else if (cursors.right.isDown)
    {
        xDirection = 1;
        //Allows the plyaer to run
        if (game.input.keyboard.isDown(Phaser.Keyboard.X))
        {
            player.body.velocity.x = playerAcceleration;
        }else{
            //  Move to the right
            player.body.velocity.x = playerVelocity;
        }        
        player.animations.play('right');
        //game.camera.x += 2;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    
    //  Allow the player to crouch if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
         //  Stand still
        player.animations.stop();

        player.frame = 9;
        
    }
    //Allow player to fire
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        weapons[currentWeapon].fire();
    }
//    //Allow plpayer to change Weapon
//    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
//        nextWeapon();
//    }

}

    function nextWeapon(){      
        //  Activate the new one
        currentWeapon++;

        if (currentWeapon === weapons.length)
        {
            currentWeapon = 0;
        }

        weapons[currentWeapon].visible = true;
        
        ammo = weapons[currentWeapon].numberOfBullets;
        ammoText.text = 'Ammo: ' + ammo;
    }

    var Weapon = {};
//  Our core Bullet class
    //  This is a simple Sprite object that we set a few properties on
    //  It is fired by all of the Weapon classes

    var Weapon = function (numberOfBullets, imageName, nextFire, bulletSpeed, 
    fireRate) {
        
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
        if (game.time.now > this.nextFire)
        {
            //  Grab the first bullet we can from the pool
            currentBullet = this.bullets.getFirstExists(false);

            if (currentBullet && this.numberOfBullets > 0)
            {
                //  And fire it
                currentBullet.reset(player.x, player.y+30);
                currentBullet.body.velocity.x = player.body.velocity.x + this.bulletSpeed*xDirection;
                this.nextFire = game.time.now + this.fireRate;
                //currentBullet.scale.set(this.scaleSize);
                //  Add and update the score
                this.numberOfBullets--;
                ammo = this.numberOfBullets;
                ammoText.text = 'Ammo: ' + ammo;
            }            
        }        
    };

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}

