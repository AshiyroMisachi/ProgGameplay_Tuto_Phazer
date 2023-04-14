import {Player as Player} from "./Player.js"
export class sceneDeux extends Phaser.Scene {
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
                
                this.player = new Player(this, 100, 450);
                this.player.setCollideWorldBounds(true);
                this.physics.add.collider(this.player, this.platforms);
                
                this.cursors = this.input.keyboard.createCursorKeys();
                //this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });
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
            }

        }