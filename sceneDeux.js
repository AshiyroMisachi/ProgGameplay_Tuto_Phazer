class sceneDeux extends Phaser.Scene {
            constructor() {
                super("sceneDeux");
            }

            init(data) {
                this.score = data.patate;
            }

            preload() {
                this.load.image('sky', 'assets/sky.png');
                this.load.image('ground', 'assets/platform.png');
                this.load.image('star', 'assets/star.png');
                this.load.image('bomb', 'assets/bomb.png');
                this.load.spritesheet('perso', 'assets/perso.png',
                    { frameWidth: 32, frameHeight: 48 });

            }

            create() {
                this.platforms;
                this.player;
                this.cursors;
                this.stars;
                this.scoreText;
                this.bombs;
                this.gameOver = false;


                this.add.image(400, 300, 'sky');
                this.platforms = this.physics.add.staticGroup();
                this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
                this.platforms.create(600, 400, 'ground');
                this.platforms.create(50, 250, 'ground');
                this.platforms.create(750, 220, 'ground');
                this.player = this.physics.add.sprite(100, 450, 'perso');
                this.player.setBounce(0.2);
                this.player.setCollideWorldBounds(true);
                this.physics.add.collider(this.player, this.platforms);
                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'perso', frame: 4 }],
                    frameRate: 20
                });
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('perso', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.cursors = this.input.keyboard.createCursorKeys();
                this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });
                //affiche un texte à l’écran, pour le score
                this.stars = this.physics.add.group({
                    key: 'star', repeat: 11,
                    setXY: { x: 12, y: 0, stepX: 70 }
                });
                this.stars.children.iterate(function (child) {
                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                }); //chaque étoile va rebondir un peu différemment
                this.physics.add.collider(this.stars, this.platforms);
                //et collisionne avec les plateformes
                this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
                //le contact perso/étoile ne génère pas de collision (overlap)
                //mais en revanche cela déclenche une fonction collectStar
                this.bombs = this.physics.add.group();
                this.physics.add.collider(this.bombs, this.platforms);
                this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
            }

            update() {
                if (this.gameOver) { return; }
                if (this.cursors.left.isDown) { //si la touche gauche est appuyée
                    this.player.setVelocityX(-160); //alors vitesse négative en X
                    this.player.anims.play('left', true); //et animation => gauche
                }
                else if (this.cursors.right.isDown) { //sinon si la touche droite est appuyée
                    this.player.setVelocityX(160); //alors vitesse positive en X
                    this.player.anims.play('right', true); //et animation => droite
                }
                else { // sinon
                    this.player.setVelocityX(0); //vitesse nulle
                    this.player.anims.play('turn'); //animation fait face caméra
                }
                if (this.cursors.up.isDown && this.player.body.touching.down) {
                    //si touche haut appuyée ET que le perso touche le sol
                    this.player.setVelocityY(-330); //alors vitesse verticale négative
                    //(on saute)
                }
            }

            collectStar(player, star) {
                star.disableBody(true, true); // l’étoile disparaît
                this.score += 10; //augmente le score de 10
                this.scoreText.setText('Score: ' + this.score); //met à jour l’affichage du score
                if (this.stars.countActive(true) === 0) {// si toutes les étoiles sont prises
                    this.stars.children.iterate(function (child) {
                        child.enableBody(true, child.x, 0, true, true);
                    }); // on les affiche toutes de nouveau
                    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
                        Phaser.Math.Between(0, 400);
                    // si le perso est à gauche de l’écran, on met une bombe à droite
                    // si non, on la met à gauche de l’écran
                    var bomb = this.bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    bomb.allowGravity = false; //elle n’est pas soumise à la gravité
                }
            }

            hitBomb(player, bomb) {
                this.physics.pause();
                this.player.setTint(0xff0000);
                this.player.anims.play('turn');
                this.gameOver = true;
            }
        }