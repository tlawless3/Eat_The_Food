var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//sprites and other images are intialized here
var mouthImg = new Image();
mouthImg.src = "imgs\\mouthsprite.png";

var bombImg = new Image();
bombImg.src = "imgs\\bomb.png";

var appleImg = new Image();
appleImg.src = "imgs\\apple.png";

//holds information about game state
var gameData = {
  mouth: {
    mouthX: 0,
    mouthY: 312,
    mouthClosed: false,
  },
  items: [],
  score: 0,
  itemSpeed: 1,
  itemGenTime: 200,
};

var gameActions = {
  //initializes game
  init: function(){
    items.init();
    setInterval(this.draw, 10);
    score.init();
  },

  //draws the game every frame
  draw: function(){
    ctx.clearRect(0, 0,  canvas.width, canvas.height);
    mouth.draw();
    items.draw();
    score.draw();
  },

  //generates Bombs and food
  generateItemObj: function(){
    var item = {};
    //percentage of items that are bombs/food determined here
    if(Math.random() > .8){
      item.type = "bomb";
    } else {
      item.type = "food";
    }
    item.y = 0;
    item.x = (Math.floor(Math.random() * 6) * 100);
    item.scored = false;

    gameData.items.push(item);
  },

  toggleMouth: function(){
    gameData.mouth.mouthClosed = !gameData.mouth.mouthClosed;
    setTimeout(this.toggleMouth, 350);
  },

  //moves mouth on arrow press
  handleArrowPress: function(event){
    if(event.keyCode === 37 && gameData.mouth.mouthX >= 100){
      gameData.mouth.mouthX -= 100;
    } else if(event.keyCode === 39 && gameData.mouth.mouthX < 399){
      gameData.mouth.mouthX += 100;
    }
  },
};

//handles score functions
var score = {
  init: function(){
    setInterval(this.scoreCheckpoints, 10)
  },

  //draws score in upper left hand corner
  draw: function(){
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + gameData.score.toString(), 10, 30);
  },

  //changes speed/genRate of items
  scoreCheckpoints: function(){
    if(gameData.score === 0){
      gameData.itemSpeed = 1;
    } else if(gameData.score === 20){
      gameData.itemSpeed = 2;
    } else if(gameData.score === 50){
      gameData.itemSpeed = 3;
    }
  },
}

//handles some functions related to bombs and food draws them
var items = {
  init: function(){
    clearInterval(interval);
    var interval = setInterval(gameActions.generateItemObj, Math.floor(gameData.itemGenTime))
  },

  draw: function(){
    //for item i in food/bombs increase y
    //then draw items
    for(var i = 0; i < gameData.items.length; i++){
      gameData.items[i].y += gameData.itemSpeed;
      ctx.drawImage(gameData.items[i].type === "food" ? appleImg : bombImg ,
        gameData.items[i].x + 12,
        gameData.items[i].y,
        25,
        25,
      );
      if(gameData.items[i].y >= 350){
        gameData.items.shift();
      }
      if(gameData.items[i].x === gameData.mouth.mouthX && gameData.items[i].y >= 312 && !gameData.items[i].scored && gameData.items[i].type === "bomb"){
        gameData.items[i].scored = true;
        gameData.score = 0;
        gameActions.toggleMouth();
      } else if((gameData.items[i].x === gameData.mouth.mouthX) && gameData.items[i].y >= 312 && !gameData.items[i].scored){
        gameData.items[i].scored = true;
        gameData.score++;
        gameActions.toggleMouth();
      }
    }
  },
};

//handles some functions related to mouth and draws mouth
var mouth = {
  draw: function(){
      if(!gameData.mouth.mouthClosed){
        ctx.drawImage(mouthImg,
          0,
          0,
          50,
          38,
          gameData.mouth.mouthX,
          gameData.mouth.mouthY,
          50,
          38,
        );
      } else if(gameData.mouth.mouthClosed) {
        ctx.drawImage(mouthImg,
          50,
          0,
          50,
          38,
          gameData.mouth.mouthX,
          gameData.mouth.mouthY,
          50,
          38,
        );
      }
  }


};

$(document).ready(function(){
  //starts the game
  gameActions.init();
  //handles arrow key press
  $(document).keydown(function(e){
    gameActions.handleArrowPress(e);
  });
});
