/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = function(game) {
    Phaser.Sprite.call(this, game, game.camera.width / 2,
        game.camera.height / 2, 'inventory_background');
    this.anchor.set(0.5);
    this.items = [];
};

Inventory.prototype = Object.create(Phaser.Sprite.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function(item) {
    this.items.push(item);

    //localStorage.setItem(item.name, foo);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};
module.exports = Inventory;
