/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Item = function(game, name, key){
    this.name = name;
    Phaser.Sprite.call(this, game, 32, game.world.height - 150, key);
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;
