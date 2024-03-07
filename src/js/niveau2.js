var boutonFeu;
var groupeBullets;
var cursors;
var player2;
var zombies;
var waveCount = 0; // Compteur de vagues
var zombCount = 0;
var gameOver = false; // Variable pour suivre l'état du jeu



export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }

  preload() {
    // chargement tuiles de jeu
    this.load.image("Phaser_tuilesdejeu_1", "src/assets/nazi_zombie_tiles.png");
    this.load.image("Phaser_tuilesdejeu_2", "src/assets/nazi_zombies_machines.png");
    this.load.image("bullet1", "src/assets/bullet.png");
    this.load.image("zombie", "src/assets/zombie.png"); // Chargez l'image du zombie
    this.load.audio('shootSound', 'src/assets/bruit_tir.mp3');
    this.load.audio('deathSound', 'src/assets/bruit_mort.m4a');
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

    // chargement de la map
    this.load.tilemapTiledJSON("carte_niveau2", "src/assets/map2.json");

  }

  create() {

    zombies = this.physics.add.group();
    zombies.hp = 100;

    this.groupe_plateformes = this.physics.add.staticGroup();

    this.porte_retour = this.physics.add.staticSprite(100, 350, "img_porte2");

    const carteDuNiveau2 = this.add.tilemap("carte_niveau2");

    const tileset1 = carteDuNiveau2.addTilesetImage("nazi_zombie_tiles", "Phaser_tuilesdejeu_1");

    const tileset2 = carteDuNiveau2.addTilesetImage("map3", "Phaser_tuilesdejeu_2");

    const calque_background_1 = carteDuNiveau2.createLayer("Calque de Tuiles 1", [tileset1, tileset2], 0, 0);

    const calque_background_2 = carteDuNiveau2.createLayer("Calque de Tuiles 2", [tileset1, tileset2], 0, 0);

    const calque_background_3 = carteDuNiveau2.createLayer("Calque de Tuiles 3", [tileset1, tileset2], 0, 0);

    calque_background_2.setCollisionByProperty({ EstSolide: true });
    this.input.keyboard.on('keydown-R', this.recommencer, this);


    this.player2 = this.physics.add.sprite(200, 450, "perso2");
    this.player2.setBounce(0.0);
    this.player2.setCollideWorldBounds(true);
    this.player2.direction = 'right';
    this.clavier = this.input.keyboard.createCursorKeys();
   
   // ajout des bruits de tir et mort.
    this.shootSound = this.sound.add('shootSound');
    this.deathSound = this.sound.add('deathSound');
    this.physics.add.collider(this.player2, calque_background_2);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 1600, 1200);
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
      frameRate: 2,
      repeat: -1
    });

    this.physics.add.overlap(this.player2, zombies, this.contactZombie, null, this);

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

    cursors = this.input.keyboard.createCursorKeys();

    // affectation de la touche A à boutonFeu
    boutonFeu = this.input.keyboard.addKey('A');

    groupeBullets = this.physics.add.group();

    this.ballesTirees = [];

    this.zombCountText = this.add.text(15, 30, 'Zombies: ' + zombCount, { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });


  }

  update() {
    if (this.clavier.left.isDown) {
      this.player2.setVelocityX(-160);
      this.player2.direction = 'left';
      this.player2.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player2.setVelocityX(160);
      this.player2.direction = 'right';
      this.player2.anims.play("anim_tourne_droite", true);
    } else if (this.clavier.up.isDown) {
      this.player2.setVelocityY(-160);
    } else if (this.clavier.down.isDown) {
      this.player2.setVelocityY(160);
    } else {
      this.player2.setVelocityX(0);
      this.player2.setVelocityY(0);
      this.player2.anims.play("anim_face");
    }
    if (!gameOver && Phaser.Input.Keyboard.JustDown(boutonFeu))  {
      this.tirer(this.player2);
  }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player2, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }

    this.healthBar.x = (this.player2.x - this.player2.width / 2) - 25; // Place la barre de santé au centre horizontal du joueur
    this.healthBar.y = this.player2.y - this.player2.height + 15; // Place la barre de santé au-dessus du joueur

    // Mise à jour de la barre de santé en fonction des points de vie du joueur
    const playerHealthPercentage = this.player2Health / 100; // Calcule le pourcentage de points de vie restants du joueur

    // Mettez à jour la largeur de la barre de santé en fonction du pourcentage de points de vie du joueur
    this.healthBar.clear(); // Efface le contenu précédent de la barre de santé
    this.healthBar.fillStyle(0x00ff00, 1); // Réapplique la couleur de remplissage (rouge)
    this.healthBar.fillRect(0, 0, 100 * playerHealthPercentage, 6.67); // Redessine la barre de santé avec la nouvelle largeur



    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      this.tirer(this.player2);
    }

    if (zombies.hp <= 0) {
      zombies.destroy();
      zombCount--;
    }

    this.zombCountText.setText('Zombies: ' + zombCount);

    if (zombCount == 0) {
      this.createWave();
    }

    zombies.children.iterate(function (zombie) {
      const dx = this.player2.x - zombie.x; // Différence de position horizontale entre le joueur et le zombie
      const dy = this.player2.y - zombie.y; // Différence de position verticale entre le joueur et le zombie

      // Calcul de la direction vers laquelle le zombie doit se déplacer
      const angle = Math.atan2(dy, dx);

      // Vitesse du zombie
      const speed = 50; // Vous pouvez ajuster cette valeur pour contrôler la vitesse du zombie

      // Déplacement du zombie selon la direction calculée
      zombie.setVelocityX(Math.cos(angle) * speed);
      zombie.setVelocityY(Math.sin(angle) * speed);
  }, this);

    this.physics.collide(zombies, this.calque_background_3, (zombie) => {
      // Inverser la vélocité du zombie
      zombie.setVelocityX(zombie.body.velocity.x * -1);
      zombie.setVelocityY(zombie.body.velocity.y * -1);
    });

  }

  tirer(player2) {
    var coefDir;
    if (this.player2.direction == 'left') {
      coefDir = -1;
    } else {
      coefDir = 1;
    }

    var bullet = groupeBullets.create(player2.x + (25 * coefDir), player2.y - 4, 'bullet1');
    bullet.setCollideWorldBounds(true);
    bullet.body.allowGravity = false;
    bullet.setVelocity(1000 * coefDir, 0);
    this.shootSound.play();

    this.ballesTirees.push(bullet); // Ajoutez la balle au tableau des balles tirées

    // Détruire la balle après 10 secondes
    setTimeout(() => {
      bullet.destroy(); // Détruit la balle
      this.ballesTirees.splice(this.ballesTirees.indexOf(bullet), 1); // Supprimez la balle du tableau des balles tirées
    }, 500);

    this.physics.add.collider(bullet, zombies, (bullet, zombie) => {
      bullet.destroy(); // Détruire la balle lorsqu'elle touche un zombie
  
      zombie.hp -= 50; // Appliquer 50 points de dégâts au zombie
  
      if (zombie.hp <= 0) {
        zombie.destroy(); // Détruire le zombie si ses points de vie tombent à zéro
        zombCount--; // Décrémenter le nombre de zombies restants
      }
    });

  }
  createWave() {
    for (var i = 0; i <= 6 + waveCount ; i++) {
        // Générer des coordonnées aléatoires pour l'apparition des zombies
        var spawnX = Phaser.Math.Between(100, 3000); // Générer une coordonnée X aléatoire dans la zone de jeu
        var spawnY = Phaser.Math.Between(100, 500); // Générer une coordonnée Y aléatoire dans la zone de jeu
        
        // Créer un zombie à ces coordonnées aléatoires
        var zombie = zombies.create(spawnX, spawnY, 'zombie');
        
        // Définir d'autres propriétés du zombie
        zombie.direction = Phaser.Math.Between(-30, 30);
        zombie.vitesse = ((waveCount + 1) / 3) * (-20);
        zombie.hp = 100; // Définir les points de vie initiaux pour chaque zombie
        zombCount++
    }
    
    // Mettre à jour le nombre total de zombies en fonction du nombre de vagues
    waveCount++;
    
}
  contactZombie(player, zombie) {
    console.log(this.player2Health)
    this.player2Health -= 1; // Réduire la santé du joueur de 10 points lorsqu'il entre en contact avec un zombie

    console.log(this.player2Health)

    if (this.player2Health <= 0) {
      // Game over si la santé du joueur atteint 0 ou moins
      // Vous pouvez ajouter votre logique de gestion du game over ici
      this.gameOver();
    }

  }


  
  gameOver() {
    // Arrête tous les éléments du jeu nécessitant une mise à jour
    this.physics.pause(); // Arrête la simulation physique

    // Affiche un message de game over au milieu de l'écran
    const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', { fontFamily: 'Arial', fontSize: 48, color: '#ff0000' });
    gameOverText.setOrigin(0.5); // Définir l'origine du texte au centre pour le centrer sur l'écran
    this.deathSound.play();

    // Marquer le jeu comme étant en mode "game over"
    gameOver = true;
}
recommencer() {
  if (gameOver) {
      this.scene.restart();
      gameOver = false; // Réinitialiser l'état du jeu
  }
}
  
}








