var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var Boot = require('./states/boot');
var Preloader = require('./states/preloader');
var Menu = require('./states/menu');
var LevelOneState = require('./states/levelOne');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOneState);
game.state.start('boot');
