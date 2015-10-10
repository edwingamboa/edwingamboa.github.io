var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

WebFontConfig = {
    google: {
        families: ['Shojumaru']
    }
};

//Game States
var Boot = require('./states/Boot');
var Preloader = require('./states/Preloader');
var Menu = require('./states/Menu');
var LevelOne = require('./states/levels/LevelOne');
var LevelOneIntro = require('./states/levels/LevelOneIntro');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOne);
game.state.add('levelOneIntro', LevelOneIntro);
game.state.start('boot');
