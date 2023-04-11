import eventsCenter from "./EventsCenter.js"
import { deplacement } from "./script.js";

export class SceneUn extends Phaser.Scene {
    constructor() {
        super("sceneUn");
    }

    init(data) {

    }

    preload() {
        this.load.image('skyred', 'assets/skyred.jfif');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.oui = true
        this.scene.run('ui-scene');
        this.platforms;
        this.player;
        this.cursors;
        this.stars;
        this.score = 0;
        this.scoreText;
        this.bombs;
        this.gameOver = false;

        this.add.image(400, 300, 'skyred').setScale(2);
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
        //this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
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
        //this.physics.world.setBounds(0, 0, 1600, 1600);
        //this.cameras.main.setBounds(0, 0, 1600, 1600);
        //this.cameras.main.startFollow(this.player); 
        //this.cameras.main.setZoom(0.5);
    }

    update() {
        if (this.gameOver) { return; }
        deplacement(this.player, this.cursors, this)

        if (this.score == 200) {
            this.scene.start('sceneDeux', {
                patate: this.score
            })
        }

    }

    collectStar(player, star) {
        star.disableBody(true, true); // l’étoile disparaît
        this.score += 10; //augmente le score de 10
        eventsCenter.emit('update-count', this.score);
        //this.scoreText.setText('Score: ' + this.score); //met à jour l’affichage du score
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

