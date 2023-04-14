import eventsCenter from "./EventsCenter.js"
export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "perso");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
        this.initEvents();
    }
     init(){
        //Variable perso
        this.speed = 160;
        this.jumpSpeed = 330;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setBounce(0.2);

        //Anims
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
     }

     initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
     }

     update(){
        if (this.cursors.left.isDown) { //si la touche gauche est appuyée
            this.setVelocityX(-this.speed); //alors vitesse négative en X
            this.anims.play('left', true); //et animation => gauche
        }
        else if (this.cursors.right.isDown) { //sinon si la touche droite est appuyée
            this.setVelocityX(this.speed); //alors vitesse positive en X
            this.anims.play('right', true); //et animation => droite
        }
        else { // sinon
            this.setVelocityX(0); //vitesse nulle
            this.anims.play('turn'); //animation fait face caméra
        }
        if (this.cursors.up.isDown && this.body.touching.down) {
            //si touche haut appuyée ET que le perso touche le sol
            this.setVelocityY(-this.jumpSpeed); //alors vitesse verticale négative
            //(on saute)
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