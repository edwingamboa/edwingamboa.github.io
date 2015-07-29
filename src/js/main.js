var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var Boot = require('./states/Boot');
var Preloader = require('./states/Preloader');
var Menu = require('./states/Menu');
var LevelOneState = require('./states/levels/LevelOne');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOneState);
game.state.start('boot');
