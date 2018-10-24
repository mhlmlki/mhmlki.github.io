var game = new Phaser.Game(960, 640, Phaser.AUTO);

var flop1, flop2, enemies, positions, tank, counter1, counter2, po1, po2, po3, po4, hitE, aaA, bbB, ccC, pau, counter3;

var StartState = {
  preload: function() {
    this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();

    this.load.image("mem", "assets/mem.png");
  },
  create: function() {
    back = this.game.add.sprite(0,0,"mem");

    back.inputEnabled = true;
    back.events.onInputDown.add(switchy, this);

    function switchy() {
      game.state.start("Play");
    }

  },
  update: function() {

  }
};

var PlayState = {
  preload: function() {
    this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();

    this.load.image("train", "assets/train.png");
    this.load.image("unit1", "assets/unit1.png");
    this.load.image("unit2", "assets/unit2.png");
    this.load.image("unit3", "assets/unit3.png");
    this.load.image("check1", "assets/check1.png");
    this.load.image("check2", "assets/check2.png");
    this.load.image("check3", "assets/check3.png");
    this.load.image("check4", "assets/check4.png");
    this.load.image("lose", "assets/lose.png");
    this.load.image("one", "assets/one.png");
    this.load.image("two", "assets/two.png");
    this.load.image("three", "assets/three.png");
    this.load.image("bg", "assets/bg.png");
    game.load.audio("aa", './assets/aa.m4a');
    game.load.audio("bb", './assets/bb.mp3');
    game.load.audio("cc", './assets/cc.mp3');
  },
  create: function() {
    background = game.add.sprite(0,0,"bg");
    game.world.sendToBack(background);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = this.game.add.sprite(-10,30,"train");
    game.physics.arcade.enable(player);
    player.enableBody = true;
    game.world.bringToTop(player);

    cursors = game.input.keyboard.createCursorKeys();
    flop1 = true; flop2 = true;

    counter1 = 0;
    counter2 = 0;

    positions = [30,150,270,390,510];

    enemies = game.add.group();
    enemies.enableBody = true;
    game.world.bringToTop(enemies);

    aaA = game.add.audio('aa');
    bbB = game.add.audio('bb');
    ccC = game.add.audio('cc');

    pau = false;
  },
  update: function() {
    if (pau ==  false) {
      counter1++;
      counter2++;

      /*CURSOR MOVEMENT*/
      if (cursors.up.isDown && player.y != 30){
        if (flop1 == true) {
          player.y -= 120;
          flop1 = false;
        }
      } else if (cursors.up.isUp) {
        flop1 = true;
      }

      if (cursors.down.isDown && player.y != 510){
        if (flop2 == true) {
          player.y += 120;
          flop2 = false;
        }
      } else if (cursors.down.isUp) {
        flop2 = true;
      }

      /*SPAWN ENEMIES*/
      if (counter1 == 60) {
        this.spawnEnemies();
        counter1 = 0;
      }

      /*MOVE ENEMIES & DESTROY ENEMIES*/
      if (enemies != undefined) {
        enemies.subAll('x', 10);
        enemies.children.forEach(function(item) {
          if (item.x == -250) { //<< this to destroy them later
            item.destroy();
          }
        });
      }

      /*ENEMIES COLLISION*/
      hitE = game.physics.arcade.collide(player, enemies);
      if (hitE) {
        lose = this.game.add.sprite(0,0,"lose");

        lose.inputEnabled = true;
        lose.events.onInputDown.add(switchy, this);

        function switchy() {
          game.paused = false;
          game.state.start("Play");
          game.sound.stopAll();
        }
        game.paused = true;
      }

      /*SPAWN CHECKPOINTS*/
      if (counter2 == 1200) {
        po1 = this.game.add.sprite(1100,0,"check1");
        po1.enableBody = true;
        game.physics.arcade.enable(po1);
      }
      if (counter2 == 2400) {
        po2 = this.game.add.sprite(1100,0,"check2");
        po2.enableBody = true;
        game.physics.arcade.enable(po2);
      }
      if (counter2 == 3600) {
        po3 = this.game.add.sprite(1100,0,"check3");
        po3.enableBody = true;
        game.physics.arcade.enable(po3);
      }
      if (counter2 == 4800) {
        po4 = this.game.add.sprite(1100,0,"check4");
        po4.enableBody = true;
        game.physics.arcade.enable(po4);
      }

      /*MOVE CHECKPOINTS*/
      if (po1 != undefined) {
        po1.x -= 10;
      }
      if (po2 != undefined) {
        po2.x -= 10;
      }
      if (po3 != undefined) {
        po3.x -= 10;
      }
      if (po4 != undefined) {
        po4.x -= 10;
      }

      /*CHECKPOINT COLLISION*/
      hitC1 = game.physics.arcade.collide(player, po1);
      hitC2 = game.physics.arcade.collide(player, po2);
      hitC3 = game.physics.arcade.collide(player, po3);
      hitC4 = game.physics.arcade.collide(player, po4);
      if (hitC1) {
        view = this.game.add.sprite(0,0,"one");
        view.inputEnabled = true;
        view.events.onInputDown.add(switchy2, this);
        pau = true;
        aaA.play();
        po1.destroy();
      }
      if (hitC2) {
        view = this.game.add.sprite(0,0,"two");
        view.inputEnabled = true;
        view.events.onInputDown.add(switchy2, this);
        pau = true;
        bbB.play();
        po2.destroy();
      }
      if (hitC3) {
        view = this.game.add.sprite(0,0,"three");
        view.inputEnabled = true;
        view.events.onInputDown.add(switchy2, this);
        pau = true;
        ccC.play();
        po3.destroy();
      }
      if (hitC4) {
        this.state.start("End");
      }

    }
    function switchy2() {
      pau = false;
      view.destroy();
      game.sound.stopAll();
    }
  },
  spawnEnemies: function() {
    var raPo = game.rnd.integerInRange(0, 4);
    var raUn = game.rnd.integerInRange(1, 3);

    tank = enemies.create(1100,positions[raPo],"unit"+raUn);
  }
};

var EndState = {
  preload: function() {
    this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();

    this.load.video("win", "assets/win.mp4");
    this.load.image("rep", "assets/rep.png");
  },
  create: function() {
    back2 = this.game.add.video("win");
    sprite = back2.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 1, 1);

    game.input.onDown.add(pause, this);

    counter3 = 0;

    function pause() {
      back2.paused = (back2.paused) ? false : true;
    }

    repbu = this.game.add.sprite(20,15,"rep");
    repbu.scale.setTo(0.05);

    repbu.inputEnabled = true;
    repbu.events.onInputDown.add(switchy, this);

    function switchy() {
      game.state.start("Play");
      back2.destroy();
    }
  },
  update: function() {
    counter3++;

    if (counter3 == 60) {
      back2.play();
    }
  }
};

game.state.add("Start", StartState);
game.state.add("Play", PlayState);
game.state.add("End", EndState);
game.state.start("Start");
