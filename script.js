import { SceneUn as SceneUn } from "./sceneUn.js";
import { sceneDeux as sceneDeux } from "./sceneDeux.js";
import {UiScene as UiScene} from "./uiScene.js"

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