var game = new Phaser.Game(800, 800, Phaser.AUTO, '', {preload: preload, 
                                                       create: create, 
                                                       update: update});

var map,
    backgroundLayer,
    impassableLayer;

function preload() {
    game.load.spritesheet('player', 'assets/sprites/characters/player.png', 32, 32);
    game.load.spritesheet('players', 'assets/sprites/characters/players.png', 32, 32);
//    game.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 32, 64);
//    game.load.spritesheet('nazi', 'assets/sprites/characters/nazi.png', 32, 32);
    game.load.tilemap('map1', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    
    game.load.image('high-fantasy-tiles', 'assets/sprites/scenery/HF1_A2.png');
    game.load.image('misc-1-tiles', 'assets/sprites/scenery/setMisc1.png');
    game.load.image('misc-2-tiles', 'assets/sprites/scenery/setMisc2.png');
    game.load.image('icons-and-equipment', 'assets/sprites/scenery/setIcons.png');
}



function create() {
    map = game.add.tilemap('map2');
//    
    map.addTilesetImage('high-fantasy-ground-tiles', 'high-fantasy-tiles')
    map.addTilesetImage('environment-1', 'misc-1-tiles')
    map.addTilesetImage('high-fantasy-misc', 'misc-2-tiles')
    map.addTilesetImage('icons-and-equipment', 'icons-and-equipment')
//    
    backgroundlayer = map.createLayer('grass-base');
    impassableLayer = map.createLayer('impassable-environment');
    passableLayer = map.createLayer('passable-environment');
    map.setCollisionBetween(1, 2000, true, 'impassable-environment');
//    
//    
    game.physics.startSystem(Phaser.Physics.ARCADE);
//    
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
    player.enableBody = true;
//    
//    baddies = game.add.group();
//    baddies.enableBody = true;
    
    
    game.physics.arcade.enable(player);
    
    // ~~~~~~~MIGHT NEED TO REMOVE THIS! MAY IMPACT ABILITY TO INTERACT WITH EDGES OF MAP~~~~~~~~~~ //
    player.body.collideWorldBounds = true;
    
    player.animations.add('walkUp', [39, 40, 41], 8, true);
    player.animations.add('walkDown', [0, 1, 2], 8, true);
    player.animations.add('walkLeft', [13, 14, 15], 8, true);
    player.animations.add('walkRight', [26, 27, 28], 8, true);
    
    player.animations.add('damagedUp', [], 8, true);
    player.animations.add('damagedDown', [], 8, true);
    player.animations.add('damagedLeft', [], 8, true);
    player.animations.add('damagedRight', [], 8, true);
    
    player.animations.add('punchUp', [46, 47, 48, 49, 50, 51], 8, true);
    player.animations.add('punchDown', [7, 8, 9, 10, 11, 12], 8, true);
    player.animations.add('punchLeft', [20, 21, 22, 23, 24, 25], 8, true);
    player.animations.add('punchRight', [33, 34, 35, 36, 37, 38], 8, true);
    
    player.animations.add('dead', [6, 19, 32, 45], 8, true);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    
}



function update() {
    game.physics.arcade.collide(player, impassableLayer);
    
        player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        player.animations.play('walkUp');
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        player.animations.play('walkDown');
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -100;
        player.animations.play('walkLeft');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 100;
        player.animations.play('walkRight');
    } else {
        player.animations.stop();
        //TODO: Player direction logic
    }
    
}