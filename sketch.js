var canvas;
var database, gameState;
var form, player, playerCount;
var coin, coin_move;
var reset;
var imgFormo;
var title;
var friends=[]
function preload() {
  function preload(){
    correcaminos_running = loadAnimation("assets/ca5.png","assets/ca4.png","assets/ca3.png","assets/ca2.png","assets/ca1.png");
    ground = loadImage("assets/Fondo_des.png");
    coyote_running = loadAnimation("assets/coyote 1.png","assets/coyote 2.png");
    dinamita = loadImage("assets/dinamita.png");
    tronco = loadImage("assets/tronco.png");
    coin = loadAnimation("assets/coin1.png","assets/coin2.png");
    reset = loadImage("assets/resetimg.png");
    imgFormo= loadImage("assets/imgnform.jpg");
    title= loadImage("assets/Title.png")

  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(imgFormo);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


