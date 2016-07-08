
/**
 * @ignore Created by Edwin Gamboa on 06/11/2015.
 */
var Item = require('./../Item');
var VerticalLayoutPopUp = require ('../../util/VerticalLayoutPopUp');

/**
 * Item that represents a clue for the player.
 * @class VocabularyItem
 * @extends Item
 * @constructor
 * @param {number} x - VocabularyItem's x coordinate within the game world.
 * @param {number} y - VocabularyItem's y coordinate within the game world.
 * @param {string} key - VocabularyItem's texture
 * belongs.
 * @param {boolean} [openImmediately = flase] - Indicates whether this
 * vocabulary item should display the message when the player picksItUp
 * @param {number} [price = 0] - The price of this item
 */
var VocabularyItem = function(x,
                              y,
                              key,
                              openImmediately,
                              price) {
    Item.call(this, x, y, key, price || 0);
    this.setProperties(key);
    this.makeDialog();
    this.openImmediately = openImmediately || false;
};

VocabularyItem.prototype = Object.create(Item.prototype);
VocabularyItem.prototype.constructor = VocabularyItem;

/**
 * Displays the definition of this VocabularyItem
 * @method VocabularyItem.use
 */
VocabularyItem.prototype.show = function() {
    this.popUp.open();
};

/**
 * Makes the dialog that is delivered to the player when he checks a vocabulary.
 * @method VocabularyItem.makeDialog
 */
VocabularyItem.prototype.makeDialog = function() {
    this.popUp = new VerticalLayoutPopUp('mediumPopUpBg', null, this.name);
    var icon = level.game.make.sprite(0, 0, this.key);
    if (icon.height > 200) {
        var scale = 200 / icon.height;
        icon.scale.x = scale;
        icon.scale.y = scale;
    }
    var dialogText = level.game.make.text(0, 0, this.definition);
    dialogText.font = level.font;
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.popUp.addElement(icon);
    this.popUp.addElement(dialogText);
    level.game.add.existing(this.popUp);
};

/**
 * Creates a car according to its key.
 * @method InteractiveCar.getOn
 * @param {string} key - VocabularyItem's key
 */
VocabularyItem.prototype.setProperties = function(key) {
    switch (key) {
        //Places
        case 'factory':
            this.name = 'Old Factory';
            this.definition = 'A building or group of buildings' +
                '\nwhere products are made';
            this.categoryIndex = 0;
            break;
        case 'school':
            this.name = 'School';
            this.definition = 'A place for education; a place where' +
                '\npeople go to learn';
            this.categoryIndex = 0;
            break;
        case 'hospital':
            this.name = 'Hospital';
            this.definition = 'A place where sick or injured people' +
                '\nare given medical care';
            this.categoryIndex = 0;
            break;
        case 'coffeeShop':
            this.name = 'Coffee Shop';
            this.definition = 'A small restaurant that serves coffee and' +
                '\nother drinks as well as simple foods';
            this.categoryIndex = 0;
            break;
        case 'bank':
            this.name = 'Bank';
            this.definition = 'An organization that keeps and lends money';
            this.categoryIndex = 0;
            break;
        case 'zoo':
            this.name = 'Zoo';
            this.definition = 'A place where many kinds of animals are ' +
                '\nkept so that people can see them';
            this.categoryIndex = 0;
            break;
        case 'gasStation':
            this.name = 'Gas Station';
            this.definition = 'A place where gasoline for vehicles is sold';
            this.categoryIndex = 0;
            break;
        case 'playground':
            this.name = 'Playground';
            this.definition = 'An outdoor area where children can play';
            this.categoryIndex = 0;
            break;
        case 'bookStore':
            this.name = 'Bookstore';
            this.definition = 'A store that sells books';
            this.categoryIndex = 0;
            break;
        case 'hotel':
            this.name = 'Hotel';
            this.definition = 'A place that has rooms in which people' +
                '\ncan stay especially when they are traveling';
            this.categoryIndex = 0;
            break;
        case 'superMarket':
            this.name = 'Super Market';
            this.definition = 'A store where customers can buy a variety' +
                '\nof foods and usually household items';
            this.categoryIndex = 0;
            break;
        case 'fireStation':
            this.name = 'Fire Station';
            this.definition = 'A building in which the members of a fire' +
                '\n department and the equipment used to' +
                '\nput out fires are located';
            this.categoryIndex = 0;
            break;
        case 'policeStation':
            this.name = 'Police Station';
            this.definition = 'A place where local \n police officers work';
            this.categoryIndex = 0;
            break;
        case 'blueHouse':
            this.name = 'House';
            this.definition = 'A building in which a family lives';
            this.categoryIndex = 0;
            break;
        case 'store':
            this.name = 'Store';
            this.definition = 'A building or room where things are sold';
            this.categoryIndex = 0;
            break;
        //Family
        case 'child':
            this.name = 'Child';
            this.definition = 'A young person; a son or daughter';
            this.categoryIndex = 1;
            break;
        case 'daughter':
            this.name = 'Daughter';
            this.definition = 'A female child';
            this.categoryIndex = 1;
            break;
        case 'family':
            this.name = 'Family';
            this.definition = 'A group of people who are related to each other';
            this.categoryIndex = 1;
            break;
        case 'father':
            this.name = 'Father';
            this.definition = 'A male parent';
            this.categoryIndex = 1;
            break;
        case 'friend':
            this.name = 'Friend';
            this.definition = 'A person who you like and enjoy being with';
            this.categoryIndex = 1;
            break;
        case 'husband':
            this.name = 'Husband';
            this.definition = 'A married man; the man someone is married to';
            this.categoryIndex = 1;
            break;
        case 'kid':
            this.name = 'Kid';
            this.definition = 'A son or daughter; a young person';
            this.categoryIndex = 1;
            break;
        case 'mother':
            this.name = 'Mother';
            this.definition = 'A female parent';
            this.categoryIndex = 1;
            break;
        case 'parent':
            this.name = 'Parent';
            this.definition = 'A person who is a father or mother; ' +
                '\na person who has a child';
            this.categoryIndex = 1;
            break;
        case 'son':
            this.name = 'Son';
            this.definition = 'A male child';
            this.categoryIndex = 1;
            break;
        case 'wife':
            this.name = 'Wife';
            this.definition = 'A married woman; the woman someone is ' +
                'married to';
            this.categoryIndex = 1;
            break;
        //Transport
        case 'car':
            this.name = 'Car';
            this.definition = 'A vehicle that has four wheels and an engine ' +
                'and \nthat is used for carrying passengers on roads';
            this.categoryIndex = 2;
            break;
        case 'jeep':
            this.name = 'Jeep';
            this.definition = 'Used for a small truck that can be driven over' +
                '\nvery rough surfaces';
            this.categoryIndex = 2;
            break;
        case 'bus':
            this.name = 'Bus';
            this.definition = 'A large vehicle that is used for carrying ' +
                'passengers \nespecially along a particular route at ' +
                'particular times';
            this.categoryIndex = 2;
            break;
        case 'truck':
            this.name = 'Truck';
            this.definition = 'A very large, heavy vehicle that is used to ' +
                'move \mlarge or numerous objects';
            this.categoryIndex = 2;
            break;
        case 'taxi':
            this.name = 'Taxi';
            this.definition = 'A car that carries passengers to a place for ' +
                'an \namount of money that is based on the distance ' +
                '\ntravelled';
            this.categoryIndex = 2;
            break;
        case 'ambulance':
            this.name = 'Ambulance';
            this.definition = 'A vehicle used for taking hurt or sick ' +
                'people to \nthe hospital especially in emergencies';
            this.categoryIndex = 2;
            break;
        //Personal Items
        case 'bracelet':
            this.name = 'Bracelet';
            this.definition = 'A piece of jewelry worn on the wrist';
            this.categoryIndex = 3;
            break;
        case 'cap':
            this.name = 'Cap';
            this.definition = 'A small, soft hat that often has a hard ' +
                'curved part \n(called a visor) that extends out over your ' +
                'eyes';
            this.categoryIndex = 3;
            break;
        case 'ring':
            this.name = 'Ring';
            this.definition = 'A piece of jewelry that is worn usually on a ' +
                'finger';
            this.categoryIndex = 3;
            break;
        case 'necklace':
            this.name = 'Necklace';
            this.definition = 'A piece of jewelry that is worn around your ' +
                'neck';
            this.categoryIndex = 3;
            break;
        case 'watch':
            this.name = 'Watch';
            this.definition = 'A device that shows what time it is and that ' +
                '\nyou wear on your wrist or carry in a pocket';
            this.categoryIndex = 3;
            break;
        case 'glasses':
            this.name = 'Glasses';
            this.definition = 'A pair of glass or plastic lenses set into a ' +
                '\nframe and worn over the eyes to help a person see';
            this.categoryIndex = 3;
            break;
    }
};

module.exports = VocabularyItem;

