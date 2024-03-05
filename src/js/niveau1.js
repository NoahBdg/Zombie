import * as fct from "/src/js/fonctions.js";

var player2;//désigne le sprite du joueur

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
    this.load.spritesheet("perso2", "src/assets/jaune.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet("jauneg", "src/assets/jaune_coursg.png", {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("jauned", "src/assets/jaune_cours.png", {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("dead", "src/assets/jaune_meurt.png", {
      frameWidth: 48,
      frameHeight: 48
    });
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


    // chargement de la carte
    const carteDuNiveau = this.add.tilemap("carte_niveau1");

    // chargement du jeu de tuiles
    const tileset1 = carteDuNiveau.addTilesetImage("map","Phaser_tuilesdejeu_1");

    const tileset2 = carteDuNiveau.addTilesetImage("map3", "Phaser_tuilesdejeu_2" );

    const calque_background_1 = carteDuNiveau.createLayer("Calque de Tuiles 1",[tileset1, tileset2] ,0 ,0);

    const calque_background_2 = carteDuNiveau.createLayer("Calque de Tuiles 2",[tileset1, tileset2], 0, 0);

    const calque_background_3 = carteDuNiveau.createLayer("Calque de Tuiles 3",[tileset1, tileset2], 0, 0);
    
    const calque_background_4 = carteDuNiveau.createLayer("calque mur",[tileset1, tileset2], 0, 0);

    // définition des tuiles de plateformes qui sont solides
    // utilisation de la propriété estSolide
    calque_background_3.setCollisionByProperty({ estSolide: true });

    this.player2 = this.physics.add.sprite(100, 450, "perso2");
    this.player2.setBounce(0.0);
    this.player2.setCollideWorldBounds(true);

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player2, this.groupe_plateformes);


    this.physics.add.collider(this.player2, calque_background_3);

    this.physics.world.setBounds(0, 0, 3200, 640);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 640);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player2);
    // player.setCollideWorldBounds(true);
this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("jauneg", {
        start: 0,
        end: 5
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 5, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });
    this.anims.create({
      key: "anim_face",
      frames: this.anims.generateFrameNumbers("dead", {
        start: 0,
        end: 1
    }),
    frameRate:2,
    repeat:-1
    });
    
    
    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("jauned", {
        start: 0,
        end: 5
      }),
      frameRate: 5,
      repeat: -1
    });
    this.healthBar = this.add.graphics(); // Crée un objet Graphics pour dessiner la barre de santé
    const screenWidth = this.cameras.main.width; // Largeur de l'écran
    this.healthBar.x = 10; // Position horizontale de la barre de santé
    this.healthBar.y = 10; // Position verticale de la barre de santé
    this.healthBar.fillStyle(0x00ff00, 1); // Couleur de remplissage de la barre de santé (rouge)
    this.healthBar.fillRect(0, 0, 100, 6.67); // Dessine un rectangle pour représenter la barre de santé, avec une largeur de 200 pixels et une hauteur de 20 pixels

    // Autres initialisations
    this.player2Health = 100; // Points de vie initiaux du joueur
    // ...
  }


  update() {
    if (this.clavier.left.isDown) {
      this.player2.setVelocityX(-160);
      this.player2.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player2.setVelocityX(160);
      this.player2.anims.play("anim_tourne_droite", true);
    } else if (this.clavier.up.isDown) {
      this.player2.setVelocityY(-160);
    } else if (this.clavier.down.isDown) {
      this.player2.setVelocityY(160);
    } else {
      this.player2.setVelocityX(0);
      this.player2.setVelocityY(0);
      this.player2.anims.play("anim_face");

      if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
        if (this.physics.overlap(this.player2, this.porte_retour)) {
          this.scene.switch("selection");
        }
      }
    }
    this.healthBar.x = (this.player2.x - this.player2.width / 2)-25; // Place la barre de santé au centre horizontal du joueur
    this.healthBar.y = this.player2.y - this.player2.height+15; // Place la barre de santé au-dessus du joueur

    // Mise à jour de la barre de santé en fonction des points de vie du joueur
    const playerHealthPercentage = this.player2Health / 100; // Calcule le pourcentage de points de vie restants du joueur

    // Mettez à jour la largeur de la barre de santé en fonction du pourcentage de points de vie du joueur
    this.healthBar.clear(); // Efface le contenu précédent de la barre de santé
    this.healthBar.fillStyle(0x00ff00, 1); // Réapplique la couleur de remplissage (rouge)
    this.healthBar.fillRect(0, 0, 100 * playerHealthPercentage, 6.67); // Redessine la barre de santé avec la nouvelle largeur
  }
}
