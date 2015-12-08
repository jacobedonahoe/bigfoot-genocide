var game = new Phaser.Game(800, 800, Phaser.AUTO, '', {preload: preload, 
                                                       create: create, 
                                                       update: update});

var map,
    backgroundLayer,
    impassableLayer;
var bigfootXPos = 500,
    bigfootYPos = 90,
    bigfootTween1,
    bigfootTween2,
    bigfootTween3,
    bigfootTween4,
    bigfootDirection,
    playerDirection,
    punchTime = 0,
    
    playerPunchUpAnim,
    playerPunchDownAnim,
    playerPunchLeftAnim,
    playerPunchRightAnim;

function preload() {
    game.load.spritesheet('player', 'assets/sprites/characters/player.png', 28, 28);
    game.load.spritesheet('players', 'assets/sprites/characters/players.png', 32, 32);
    game.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 85, 120);
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
    
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    setupPlayer();
    setupBigfoot();
}



function setupPlayer() {
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
    playerDirection = "down";
    
    game.physics.arcade.enable(player);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    
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
    
    player.animations.add('punchUp', [46, 47, 48, 49, 50, 51], 8);
    player.animations.add('punchDown', [7, 8, 9, 10, 11, 12], 8);
    player.animations.add('punchLeft', [20, 21, 22, 23, 24, 25], 8);
    player.animations.add('punchRight', [33, 34, 35, 36, 37, 38], 8);
    
    playerPunchUpAnim = player.animations.getAnimation("punchUp");
    playerPunchDownAnim = player.animations.getAnimation("punchDown");
    playerPunchLeftAnim = player.animations.getAnimation("punchLeft");
    playerPunchRightAnim = player.animations.getAnimation("punchRight");
    
    player.animations.add('dead', [6, 19, 32, 45], 8, true);
}



function setupBigfoot() {
    bigfoot = game.add.sprite(bigfootXPos, bigfootYPos, 'bigfoot');
    
    game.physics.arcade.enable(bigfoot);
    
    bigfoot.anchor.x = 0.5;
    bigfoot.anchor.y = 0.5;
    
    bigfoot.body.collideWorldBounds = true;
    
    bigfoot.animations.add('standBottomLeft', [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
    bigfoot.animations.add('standBottomRight', [8, 9, 10, 11, 12, 13, 14, 15], 6, true);
    bigfoot.animations.add('standTopLeft', [16, 17, 18, 19, 20, 21], 6, true);
    bigfoot.animations.add('standTopRight', [24, 25, 26, 27, 28, 29], 6, true);
    
    bigfoot.animations.add('walkBottomLeft', [32, 33, 34, 35, 36, 37], 6, true);
    bigfoot.animations.add('walkBottomRight', [40, 41, 42, 43, 44, 45], 6, true);
    bigfoot.animations.add('walkTopLeft', [48, 49, 50, 51, 52, 53], 6, true);
    bigfoot.animations.add('walkTopRight', [56, 57, 58, 59, 60, 61], 6, true);
    
    bigfoot.animations.play('standBottomLeft');
}



function update() {
    console.log(player.animations.currentAnim.name);
    game.physics.arcade.overlap(player, bigfoot, epicBattle, null, this);
    game.physics.arcade.collide(player, impassableLayer);
    
    checkMovePlayer();
    checkPlayerPunch();
    
    if (game.physics.arcade.distanceBetween(bigfoot, player) < 200) {
        game.tweens.removeFrom(bigfoot);
        game.physics.arcade.moveToObject(bigfoot, player);
        
        setBigfootsDirection();        
    } else {
        stopBigfoot();
    }
}



function epicBattle(player, bigfoot) {
    // TODO: Handle collision
}



function checkMovePlayer() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        if (!playerIsPunching()) {
            player.animations.play('walkUp');
        }
        playerDirection = "up";
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        if (!playerIsPunching()) {
            player.animations.play('walkDown');
        }
        playerDirection = "down";
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -100;
        if (!playerIsPunching()) {
            player.animations.play('walkLeft');
        }
        playerDirection = "left";
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 100;
        if (!playerIsPunching()) {
            player.animations.play('walkRight');
        }
        playerDirection = "right";
    } else {
        if (!playerIsPunching()) {
            player.animations.stop();
        }
    }
}



function playerIsPunching() {
    return playerPunchUpAnim.isPlaying ||
        playerPunchDownAnim.isPlaying ||
        playerPunchLeftAnim.isPlaying ||
        playerPunchRightAnim.isPlaying;
}



function checkPlayerPunch() {
    if (spacebar.isDown) {
        if (game.time.now > punchTime) {
            switch (playerDirection) {
                case "up":
                    playerPunchUpAnim.play();
                    break;
                case "down":
                    playerPunchDownAnim.play();
                    break;
                case "left":
                    playerPunchLeftAnim.play();
                    break;
                case "right":
                    playerPunchRightAnim.play();
                    break;
                default:
                    break;
            }
            punchTime = game.time.now + 1500;
        }
    }
}



function setBigfootsDirection() {
    var currentAngle = (bigfoot.body.angle * 180) / Math.PI;
    
    if (valueIsBetween(currentAngle, 90, 180)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomLeft")) {
            bigfoot.animations.play("walkBottomLeft");
            bigfootDirection = "bottomLeft";
        }
    } else if (valueIsBetween(currentAngle, 0, 90)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomRight")) {
            bigfoot.animations.play("walkBottomRight");
            bigfootDirection = "bottomRight";
        }
    } else if (valueIsBetween(currentAngle, -90, 0)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopRight")) {
            bigfoot.animations.play("walkTopRight");
            bigfootDirection = "topRight";
        }
    } else if (valueIsBetween(currentAngle, -180, -90)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopLeft")) {
            bigfoot.animations.play("walkTopLeft");
            bigfootDirection = "topLeft";
        }
    } 
}



function stopBigfoot() {
    bigfoot.body.velocity.x = 0;
    bigfoot.body.velocity.y = 0;

    switch (bigfootDirection) {
        case "bottomLeft":
            bigfoot.animations.play("standBottomLeft");
            break;
        case "bottomRight":
            bigfoot.animations.play("standBottomRight");
            break;
        case "topLeft":
            bigfoot.animations.play("standTopLeft");
            break;
        case "topRight":
            bigfoot.animations.play("standTopRight");
            break;
        default:
            bigfoot.animations.play("standBottomLeft");
            break;
    }
}



function valueIsBetween(toCompareVal, smallVal, bigVal) {
    return toCompareVal > smallVal && toCompareVal < bigVal;
}