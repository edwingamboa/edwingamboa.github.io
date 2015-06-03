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
var scoreText;
var ammoText;

function create() {
    
    game.world.setBounds(0, 0, 3000, 600);
           
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

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
    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    scoreText.fixedToCamera = true;
    
    //  The score
    ammoText = game.add.text(game.camera.width - 150, 16, 'Ammo: 0', {fontSize: '32px', fill: '#000'});
    ammoText.fixedToCamera = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
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
       
}



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

