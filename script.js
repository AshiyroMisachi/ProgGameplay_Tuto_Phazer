import { SceneUn as SceneUn } from "./sceneUn.js";
import { sceneDeux as sceneDeux } from "./sceneDeux.js";
import {UiScene as UiScene} from "./uiScene.js"


export function deplacement(player, cursors){
    if (cursors.left.isDown) { //si la touche gauche est appuyée
        player.setVelocityX(-160); //alors vitesse négative en X
        player.anims.play('left', true); //et animation => gauche
    }
    else if (cursors.right.isDown) { //sinon si la touche droite est appuyée
        player.setVelocityX(160); //alors vitesse positive en X
        player.anims.play('right', true); //et animation => droite
    }
    else { // sinon
        player.setVelocityX(0); //vitesse nulle
        player.anims.play('turn'); //animation fait face caméra
    }
    if (cursors.up.isDown && player.body.touching.down) {
        //si touche haut appuyée ET que le perso touche le sol
        player.setVelocityY(-330); //alors vitesse verticale négative
        //(on saute)
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800, height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [SceneUn, sceneDeux, UiScene]
}
new Phaser.Game(config);


