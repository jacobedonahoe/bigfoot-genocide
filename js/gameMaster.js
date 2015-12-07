var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, 
                                                       create: create, 
                                                       update: update});

var bigfootXPos = 500,
    bigfootYPos = 90;



function preload() {
    game.load.spritesheet('player', 'assets/sprites/characters/player.png', 32, 32);
    game.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 85, 120);
//    game.load.spritesheet('nazi', 'assets/sprites/characters/nazi.png', 32, 32);
}



function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    setupPlayer();
    setupBigfoot();
    
    cursors = game.input.keyboard.createCursorKeys();
}



function setupPlayer() {
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
    
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
}



function setupBigfoot() {
    bigfoot = game.add.sprite(bigfootXPos, bigfootYPos, 'bigfoot');
    
    game.physics.arcade.enable(bigfoot);
    
    bigfoot.body.collideWorldBounds = true;
    
    bigfoot.animations.add('standBottomLeft', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    bigfoot.animations.add('standBottomRight', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);
    bigfoot.animations.add('standTopLeft', [16, 17, 18, 19, 20, 21], 8, true);
    bigfoot.animations.add('standTopRight', [24, 25, 26, 27, 28, 29], 8, true);
    
    bigfoot.animations.add('walkBottomLeft', [32, 33, 34, 35, 36, 37], 8, true);
    bigfoot.animations.add('walkBottomRight', [40, 41, 42, 43, 44, 45], 8, true);
    bigfoot.animations.add('walkTopLeft', [48, 49, 50, 51, 52, 53], 8, true);
    bigfoot.animations.add('walkTopRight', [56, 57, 58, 59, 60, 61], 8, true);
    
    bigfoot.animations.play('standBottomLeft');
    
    addBigfootDocileBehavior();
}



function addBigfootDocileBehavior() {    
    var tween1 = game.add.tween(bigfoot).to({x: bigfootXPos - 100, y: bigfootYPos + 100},
                                            1200,
                                            Phaser.Easing.Linear.None,
                                            false,
                                            3000);
    tween1.onStart.add(function() {
        bigfoot.animations.play('walkBottomLeft');
    }, this);
    
    tween1.onComplete.add(function() {
        bigfoot.animations.play('standBottomRight');
        bigfootXPos = bigfoot.body.x;
        bigfootYPos = bigfoot.body.y;
        tween2.start();
    }, this);
    
    
    
    
    var tween2 = game.add.tween(bigfoot).to({x: bigfootXPos + 100, y: bigfootYPos + 100},
                                            1200,
                                            Phaser.Easing.Linear.None,
                                            false,
                                            3000);
    tween2.onStart.add(function() {
        bigfoot.animations.play('walkBottomRight');
    }, this);
    
    tween2.onComplete.add(function() {
        bigfoot.animations.play('standTopRight');
        bigfootXPos = bigfoot.body.x;
        bigfootYPos = bigfoot.body.y;
        tween3.start();
    }, this);
    
    
    
    
    var tween3 = game.add.tween(bigfoot).to({x: bigfootXPos + 100, y: bigfootYPos - 100},
                                            1200,
                                            Phaser.Easing.Linear.None,
                                            false,
                                            3000);
    tween3.onStart.add(function() {
        bigfoot.animations.play('walkTopRight');
    }, this);
    
    tween3.onComplete.add(function() {
        bigfoot.animations.play('standTopLeft');
        bigfootXPos = bigfoot.body.x;
        bigfootYPos = bigfoot.body.y;
        tween4.start();
    }, this);
    
    
    
    
    var tween4 = game.add.tween(bigfoot).to({x: bigfootXPos - 100, y: bigfootYPos - 100},
                                            1200,
                                            Phaser.Easing.Linear.None,
                                            false,
                                            3000);
    tween4.onStart.add(function() {
        bigfoot.animations.play('walkTopLeft');
    }, this);
    
    tween4.onComplete.add(function() {
        bigfoot.animations.play('standBottomLeft');
        bigfootXPos = bigfoot.body.x;
        bigfootYPos = bigfoot.body.y;
        tween1.start();
    }, this);
    
    
    
    
    
    tween1.start();
}



function update() {
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