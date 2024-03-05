import * as fct from "/src/js/fonctions.js";

export default class niveau1 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau1" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    // chargement tuiles de jeu
    this.load.image("Phaser_tuilesdejeu_1", "src/assets/nazi_zombie_tiles.png");
    this.load.image("Phaser_tuilesdejeu_2", "src/assets/nazi_zombies_machines.png");

    // chargement de la carte
    this.load.tilemapTiledJSON("carte_niveau1", "src/assets/map1.json");
  }

  create() {
    fct.doNothing();
    fct.doAlsoNothing();

    //this.add.image(400, 300, "img_ciel");
    //this.groupe_plateformes = this.physics.add.staticGroup();
    //this.groupe_plateformes.create(200, 584, "img_plateforme");
    //this.groupe_plateformes.create(600, 584, "img_plateforme");

    this.porte_retour = this.physics.add.staticSprite(100, 530, "img_porte1");

    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);

    // chargement de la carte
    const carteDuNiveau = this.add.tilemap(this, "carte_niveau1");

    // chargement du jeu de tuiles
    const tileset1 = carteDuNiveau.addTilesetImage("tuiles_de_jeu1","Phaser_tuilesdejeu_1");

    const tileset2 = carteDuNiveau.addTilesetImage("tuiles_de_jeu2", "Phaser_tuilesdejeu_2" );

    const calque_background_1 = carteDuNiveau.createLayer("Calque de Tuiles 1",[tileset1, tileset2] ,0 ,0);

    const calque_background_2 = carteDuNiveau.createLayer("Calque de Tuiles 2",[tileset1, tileset2], 0, 0);

    const calque_background_3 = carteDuNiveau.createLayer("Calque de Tuiles 3",[tileset1, tileset2], 0, 0);
    
    const calque_background_4 = carteDuNiveau.createLayer("Calque mur",[tileset1, tileset2], 0, 0);

    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    //calque_background_3.setCollisionByProperty({ estSolide: true });

    this.physics.add.collider(this.player, calque_background_3);

    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);
    // player.setCollideWorldBounds(true);

  }


  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      //this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      // this.player.anims.play("anim_tourne_droite", true);
    } else if (this.clavier.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.clavier.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      //this.player.anims.play("anim_face");


      if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
        if (this.physics.overlap(this.player, this.porte_retour)) {
          this.scene.switch("selection");
        }
      }
    }
  }
}
