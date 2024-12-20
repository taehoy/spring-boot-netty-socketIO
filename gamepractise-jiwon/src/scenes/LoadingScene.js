import Phaser from 'phaser';
import fontPng from "../assets/font/font.png";
import fontXml from "../assets/font/font.xml";
import bgImg from '../assets/images/background.png';
import catImg from '../assets/images/cat.png';
import beamImg from '../assets/images/beam.png';
import fireOgg from "../assets/sounds/fire.ogg";
import popOgg from "../assets/sounds/pop.ogg";
import pickOgg from "../assets/sounds/pickExpUp.ogg";
import hurtOgg from "../assets/sounds/hurt.ogg";
import gameoverOgg from "../assets/sounds/gameover.ogg";
import pauseIn from "../assets/sounds/pauseIn.ogg";
import pauseOut from "../assets/sounds/pauseOut.ogg";
import hitEnemyOgg from "../assets/sounds/hitEnemy.ogg";
import batImg from "../assets/spritesheets/bat.png";
import dogImg from "../assets/spritesheets/dog.png";
import eyeballImg from "../assets/spritesheets/eyeball.png";
import expUpImg from '../assets/spritesheets/exp-up.png';
import explosionImg from '../assets/spritesheets/explosion.png';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
        // bootGame : 이 scene의 identifier
    }

    preload() {
        this.load.image("background", bgImg);
        this.load.image("cat", catImg);
        this.load.image("beam", beamImg);

        this.load.spritesheet("bat", batImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("dog", dogImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("eyeball", eyeballImg, {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("explosion", explosionImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("exp-up", expUpImg, {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.bitmapFont("pixelFont", fontPng, fontXml);
        this.load.audio("audio_beam", fireOgg);
        this.load.audio("audio_explosion", popOgg);
        this.load.audio("audio_pickup", pickOgg);
        this.load.audio("audio_hurt", hurtOgg);
        this.load.audio("audio_gameover", gameoverOgg);
        this.load.audio("pause_in", pauseIn);
        this.load.audio("pause_out", pauseOut);
        this.load.audio("hit_enemy", hitEnemyOgg);
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        this.anims.create({
            key: "bat_anim",
            frames: this.anims.generateFrameNumbers("bat"),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: "dog_anim",
            frames: this.anims.generateFrameNumbers("dog"),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: "eyeball_anim",
            frames: this.anims.generateFrameNumbers("eyeball"),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("exp-up", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("exp-up", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });
    }
}