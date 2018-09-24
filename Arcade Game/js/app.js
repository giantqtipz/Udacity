var tileColumns = [100, 200, 300, 400, 500];
var tileRows = [60, 140, 220];

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor((Math.random() * 300) + 50);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if((this.y === player.y) && 
        (player.x - this.x < 70 && player.x - this.x > - 70)){ 
        player.reset();
    }

    this.x += (this.speed * dt);
    if(this.x > 500){
        this.reset();
    }
};  

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(){
    this.x = 0;
    this.y = tileRows[Math.floor((Math.random() * 3))];
    this.speed = Math.floor((Math.random() * 300) + 50);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(){

    for(var obstacle of allObstacles){
        if((this.y === obstacle.y) && (this.x === obstacle.x)){
            player.handleInput("disable");
        }
        if(this.y < 60){
            this.reset();
            obstacle.reset();
        }
    }
    
}

Player.prototype.reset = function(){
    this.y = 380;
    this.x = 200;
}

Player.prototype.handleInput = function(input){

    switch(input){
        case "disable":         
            return;
        case "left":
            if(this.x > 0){ this.x -= 100; }
            break; 
        case "right":
            if(this.x < 400){ this.x += 100; }
            break; 
        case "up":
            if(this.y > 0){ this.y -= 80; }
            break; 
        case "down":            
            if(this.y < 400){ this.y += 80; }
            break;                                             
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var enemy1 = new Enemy(-100, tileRows[Math.floor((Math.random() * 3))]);
var enemy2 = new Enemy(-100, tileRows[Math.floor((Math.random() * 3))]);
var enemy3 = new Enemy(-100, tileRows[Math.floor((Math.random() * 3))]);
var enemy4 = new Enemy(-100, tileRows[Math.floor((Math.random() * 3))]);
var enemy5 = new Enemy(-100, tileRows[Math.floor((Math.random() * 3))]);

allEnemies.push(enemy1, enemy2, enemy3, enemy4, enemy5);

var player = new Player(200, 380);


var Obstacle = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Rock.png';
}

Obstacle.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Obstacle.prototype.reset = function(){
    this.x = tileColumns[Math.floor((Math.random() * 4))];
    this.y = tileRows[Math.floor((Math.random() * 3))];
}

Obstacle.prototype.update = function(){

}

var allObstacles = [];
var obstacle1 = new Obstacle(tileColumns[Math.floor((Math.random() * 4))], 60);
var obstacle2 = new Obstacle(tileColumns[Math.floor((Math.random() * 4))], 140);
var obstacle3 = new Obstacle(tileColumns[Math.floor((Math.random() * 4))], 220);
var obstacle4 = new Obstacle(tileColumns[Math.floor((Math.random() * 4))], tileRows[Math.floor((Math.random() * 3))]);
allObstacles.push(obstacle1, obstacle2, obstacle3, obstacle4);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {         
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'

    };

    player.handleInput(allowedKeys[e.keyCode]);
});
