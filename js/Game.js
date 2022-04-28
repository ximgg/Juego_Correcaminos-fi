class Game{
    constructor(){
        this.resetTitlle= createElement ("h1");
        this.resetButton= createButton();
        this.leaderBoardTitlle= createElement("h2");
        this.leaderBoard1 = createElement("h2");
        this.leaderBoard2 = createElement("h2");
        this.playerMoving = false;
        this.leftKeyActive = false;

    }
    getState(){
        var gameStateRef= database.ref("gameState");
        gameStateRef.on("value", function(data){
           gameState= data.val();
        });
    }

    update(){
        database.ref("/").update({
            gameState:state
        });
    }

    start(){
        player = new Player();
        playerCount= player.getCount();
        form = new Form();
        form.display();
        correcaminos = createSprite(width/2, height+50);
        correcaminos.addAnimation("correcaminos",correcaminos_running);
        coyote = createSprite(width/2 -50, height-100);
        coyote.addAnimation("coyote", coyote_running);
        friends=[correcaminos,coyote]
        coins = new Group();
        obstacles = new Group();
        //Buscar imagen 
        //this.addSprite()

        var obstaclesPositions = [
            { x: width / 2 + 250, y: height - 800, image: dinamita},
            { x: width / 2 - 150, y: height - 1300, image: tronco },
            { x: width / 2 + 250, y: height - 1800, image: dinamita },
            { x: width / 2 - 180, y: height - 2300, image: tronco },
            { x: width / 2, y: height - 2800, image: dinamita },
            { x: width / 2 - 180, y: height - 3300, image: tronco },
            { x: width / 2 + 180, y: height - 3300, image: dinamita },
            { x: width / 2 + 250, y: height - 3800, image: dinamita },
            { x: width / 2 - 150, y: height - 4300, image: tronco },
            { x: width / 2 + 250, y: height - 4800, image: dinamita },
            { x: width / 2, y: height - 5300, image: tronco  },
            { x: width / 2 - 180, y: height - 5500, image: dinamita }
          ];
          this.addSprites(coins, 18, coin, 0.09);

          this.addSprites(
            obstacles,
            obstaclesPositions.length,
            //varibale de los obtaculos cargados,
            tronco,

            0.04,
            obstaclesPositions
          );
      
    }

    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
      }

      handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("RoadRunner");
    
        this.resetTitle.html("Reiniciar juego");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 + 200, 40);
    
        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 230, 100);
    
        this.leadeboardTitle.html("Puntuación");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);
    
        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 50, 80);
    
        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 50, 130);
      }
    
      play() {
        this.handleElements();
        this.handleResetButton();
    
        Player.getPlayersInfo();
        player.PersonajesAtEnd();
    
        if (allPlayers !== undefined) {
          image( ground, 0, -height * 5, width, height * 6);
    
          this.showLife();
          this.showLeaderboard();
    
          //índice de la matriz
          var index = 0;
          for (var plr in allPlayers) {
            //agrega 1 al índice por cada bucle
            index = index + 1;
    
            //utiliza datos de la base de datos para mostrar los autos en las direcciones x e y
            var x = allPlayers[plr].positionX;
            var y = height - allPlayers[plr].positionY;
    
            var currentlife = allPlayers[plr].life;
    
            if (currentlife <= 0) {
              friends[index - 1].scale = 0.3;
            }
    
            friends[index - 1].position.x = x;
            friends[index - 1].position.y = y;
    
            if (index === player.index) {
              stroke(10);
              fill("red");
              ellipse(x, y, 60, 60);
    
              this.handleCoins(index);
              this.handleFriendsACollisionWithFriendsB(index);
              this.handleObstacleCollision(index);
    
              if (player.life <= 0) {
                this.playerMoving = false;
              }
    
              // Cambiar la posición de la cámara en la dirección y
              camera.position.y = cars[index - 1].position.y;
            }
          }
    
          if (this.playerMoving) {
            player.positionY += 5;
            player.update();
          }
    
          // manejando eventos teclado
          this.handlePlayerControls();
    
          // Línea de meta
          const finshLine = height * 6 - 100;
    
          if (player.positionY > finshLine) {
            gameState = 2;
            player.rank += 1;
            Player.updateFriendsAtEnd(player.rank);
            player.update();
            this.showRank();
          }
    
          drawSprites();
        }
      }
    
      handleResetButton() {
        this.resetButton.mousePressed(() => {
          database.ref("/").set({
            playerCount: 0,
            gameState: 0,
            players: {},
            friendsAtEnd: 0
          });
          window.location.reload();
        });
      }
    
      showLife() {
        push();
       // image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
        fill("#f50057");
        rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
        noStroke();
        pop();
      }
    
    
      showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    Esta etiqueta se utiliza para mostrar cuatro espacios.
          leader1 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader2 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
        }
    
        if (players[1].rank === 1) {
          leader1 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
    
          leader2 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
        }
    
        this.leader1.html(leader1);
        this.leader2.html(leader2);
      }
    
      handlePlayerControls() {
        if (!this.blast) {
          if (keyIsDown(UP_ARROW)) {
            this.playerMoving = true;
            player.positionY += 10;
            player.update();
          }
    
          if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
            this.leftKeyActive = true;
            player.positionX -= 5;
            player.update();
          }
    
          if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
            this.leftKeyActive = false;
            player.positionX += 5;
            player.update();
          }
        }
      }
    
    
      handleCoins(index) {
        friends[index - 1].overlap(coins, function(collector, collected) {
          player.score += 21;
          player.update();
           //recolectado está el sprite en el grupo de recolectables que desencadenaron
          //el evento
          collected.remove();
        });
      }
    
      handleObstacleCollision(index) {
        if (friends[index - 1].collide(obstacles)) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
    
          //Reduciendo la vida del jugador
          if (player.life > 0) {
            player.life -= 185 / 4;
          }
    
          player.update();
        }
      }
    
      handleFriendsACollisionWithFriendsB(index) {
        if (index === 1) {
          if (friends[index - 1].collide(friends[1])) {
            if (this.leftKeyActive) {
              player.positionX += 100;
            } else {
              player.positionX -= 100;
            }
    
            //Reduciendo la vida del jugador
            if (player.life > 0) {
              player.life -= 185 / 4;
            }
    
            player.update();
          }
        }
        if (index === 2) {
          if (friends[index - 1].collide(friends[0])) {
            if (this.leftKeyActive) {
              player.positionX += 100;
            } else {
              player.positionX -= 100;
            }
    
            //Reduciendo la vida del jugador
            if (player.life > 0) {
              player.life -= 185 / 4;
            }
    
            player.update();
          }
        }
      }
    
      showRank() {
        swal({
          title: `¡Impresionante!${"\n"}Posición${"\n"}${player.rank}`,
          text: "Llegaste a la meta con éxito",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }
    
      gameOver() {
        swal({
          title: `Fin del juego`,
          text: "¡Ups perdiste la carrera!",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
          imageSize: "100x100",
          confirmButtonText: "Gracias por jugar"
        });
      }
    
      end() {
        console.log("Fin del juego");
      }

}