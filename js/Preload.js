var BGGame = BGGame || {};

//loading the game assets
BGGame.Preload = function(){};

BGGame.Preload.prototype = {
  preload: function() {
    //show loading screen
//    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
//    this.preloadBar.anchor.setTo(0.5);

//    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.spritesheet('player', 'assets/sprites/characters/player.png', 28, 28);
    this.game.load.spritesheet('baddie', 'assets/sprites/characters/baddie.png', 28, 28);
    this.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 85, 120);
    this.load.tilemap('map1', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('map2', 'assets/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    
    this.load.image('high-fantasy-tiles', 'assets/sprites/scenery/HF1_A2.png');
    this.load.image('misc-1-tiles', 'assets/sprites/scenery/setMisc1.png');
    this.load.image('misc-2-tiles', 'assets/sprites/scenery/setMisc2.png');
    this.load.image('icons-and-equipment', 'assets/sprites/scenery/setIcons.png');
    
    this.load.spritesheet('spongebob', 'assets/sprites/victory-screech.png', 500, 360);
    
    this.load.audio('victory-screech', 'assets/audio/victory-screech.m4a');
    this.load.audio('troll', 'assets/audio/troll.m4a');
    
  },
  create: function() {
    this.state.start('Game');
  }
};