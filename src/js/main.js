/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var BootState = require('./states/boot');
//var MenuState = require('./states/menu');
//var Level1State = require('./states/play');
//var PreloadState = require('./states/preload');

//var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'wopic');

// Game States
//game.state.add('boot', BootState);
//game.state.add('menu', MenuState);
//game.state.add('play', PlayState);
//game.state.add('preload', PreloadState);


//game.state.start('play');


var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {preload: preload, 
    create: create, update: update, render: render});

function preload() {

    game.load.image('sky', 'assets/images/sky.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.image('inventory_button', 'assets/images/inventory.png');
    game.load.spritesheet('character', 'assets/sprites/character.png', 32, 48);
    for (var i = 1; i <= 2; i++)
    {
        game.load.image('bullet' + i, 'assets/images/bullet' + i + '.png');
    }
    game.stage.backgroundColor = '#82CAFA';

}

var platforms;
var cursors;

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
var inventoryButton;

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
    this.player = new Player(this.game, 250, 500, 100, 0.2, 300);
    this.game.add.existing(this.player);
    
    weapons.push(new Weapon(this.game, this.player,  30, 'bullet1', 0, 400, 100));
    weapons.push(new Weapon(this.game, this.player, 40, 'bullet2', 0, 500, 100));
    
    currentWeapon = 0;
    
    for (var i = 1; i < weapons.length; i++)
    {
       weapons[i].visible = false;
    }

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
    game.camera.follow(this.player);   
    
    // add inventory button with a callback    
    inventoryButton = game.add.button(game.camera.width-50, 100, 'inventory_button', displayInventory, this);
    inventoryButton.anchor.setTo(0.5,0.5);
    inventoryButton.fixedToCamera = true;
    
}

function displayInventory(){
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(this.player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(this.player, stars, collectStar, null, this);


    if (cursors.left.isDown)
    {
        xDirection = -1;
        if (game.input.keyboard.isDown(Phaser.Keyboard.X))
        {
            this.player.runLeft();
        }else{
            //  Move to the left
            this.player.moveLeft();
        }   
    }
    else if (cursors.right.isDown)
    {
        xDirection = 1;
        //Allows the plyaer to run
        if (game.input.keyboard.isDown(Phaser.Keyboard.X))
        {
            this.player.runRight();
        }else{
            //  Move to the right
            this.player.moveRight();
        }                
    }
    else
    {
        //  Stand still
        this.player.stop();
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.jump();
    }
    
    //  Allow the player to crouch if they are touching the ground.
    if (cursors.up.isDown && this.player.body.touching.down)
    {
//         this.player.crouch();
        
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

