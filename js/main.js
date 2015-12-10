    var BGGame = BGGame || {};

    BGGame.game = new Phaser.Game(800, 800, Phaser.AUTO, '');
    BGGame.game.state.add('Boot', BGGame.Boot);
    BGGame.game.state.add('Preload', BGGame.Preload);
    BGGame.game.state.add('Game', BGGame.Game);

    BGGame.game.state.start('Boot');