import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Snake</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas className="border-2"></canvas>
      <p>Score: {score}</p>
      {setupCanvas()}
      {run()}
    </div>
  )
}

//Canvas Details
var canvas = undefined;
var c = undefined;
var canvas_x = undefined;
var canvas_y = undefined;

//Snake Details
var snake = undefined;
var food = undefined;
var segmentSize = 10;
var speed = 2;
var score = 0;

function run() {
  if (typeof window !== "undefined") {
    animate();
  }
}

//Canvas init stuff
function setupCanvas() {
  if (typeof window !== "undefined") {
    canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth * (2 / 3);
    canvas.height = window.innerHeight * (2 / 3);
    canvas_x = canvas.getBoundingClientRect().left;
    canvas_y = canvas.getBoundingClientRect().top;
    c = canvas.getContext('2d');

    snake = new Snake(canvas.width / 2, canvas.height / 2);
    food = new Food();

    window.addEventListener('keydown', function (event) {
      switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
          snake.head.dx = -speed;
          snake.head.dy = 0;
          break;
        case "KeyD":
        case "ArrowRight":
          snake.head.dx = speed;
          snake.head.dy = 0;
          break;
        case "KeyW":
        case "ArrowUp":
          snake.head.dy = -speed;
          snake.head.dx = 0;
          break;
        case "KeyS":
        case "ArrowDown":
          snake.head.dx = 0;
          snake.head.dy = speed;
          break;
      }
    });
  }
}

//Segment Class
function SnakeSegment(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;

  this.xForDrawing = this.x - segmentSize / 2;
  this.yForDrawing = this.y - segmentSize / 2;

  this.draw = function () {
    c.beginPath();
    c.rect(this.xLeftBound, this.yTopBound, segmentSize, segmentSize);
    c.fill();
  }

  this.update = function (x, y) {
    this.x = x;
    this.y = y;
    this.xLeftBound = this.x - segmentSize / 2;
    this.xRightBound = this.x + segmentSize / 2;
    this.yTopBound = this.y - segmentSize / 2;
    this.yBottomBound = this.y + segmentSize / 2;
    this.checkWallCollision();
    this.draw();
  }

  this.checkWallCollision = function () {
    if (this.xLeftBound <= 0 || this.xRightBound >= canvas.width) {
      this.dx = 0;
    }
    if (this.yTopBound <= 0 || this.yBottomBound >= canvas.height) {
      this.dy = 0;
    }
  }
}

//Snake Class
function Snake(startX, startY) {
  this.segmentArray = [];

  //create snake head
  var s = new SnakeSegment(startX, startY, speed, 0);
  this.segmentArray.push(s);
  this.head = this.segmentArray[0];

  this.update = function () {
    //iterate through all pieces of the snake
    for (var i = 0; i < this.segmentArray.length; i++) {
      if(i === 0){
        c.fillStyle = 'black';
        this.segmentArray[i].update(this.segmentArray[i].x + this.segmentArray[i].dx, 
          this.segmentArray[i].y + this.segmentArray[i].dy);
        
      }
      else{
        c.fillStyle = 'blue';
        console.log(`head x: ${this.segmentArray[1]}, tail x: ${this.segmentArray[0]}`);
        this.segmentArray[i].update(this.segmentArray[i-1].x, this.segmentArray[i-1].y);
      }
    }
  }

  //Add another segment to the snake
  this.append = function (x, y) {
    //Find the direction of the head
    var dXCoefficient = 0;
    var dYCoefficient = 0;

    if(this.head.dx < 0){
      dXCoefficient = -1;
    }
    if(this.head.dx > 0){
      dXCoefficient = 1;
    }
    if(this.head.dy < 0){
      dYCoefficient = -1;
    }
    if(this.head.dy > 0){
      dYCoefficient = 1;
    }

    //Get the butt of the snake
    var backSegment = this.segmentArray[this.segmentArray.length-1];

    //Get new positions, adjusted by the direction and offset by segment size
    var newX = backSegment.x - (segmentSize * dXCoefficient);
    var newY = backSegment.y - (segmentSize * dYCoefficient);

    console.log(`back segment y: ${backSegment.y}, new segment y:${newY}`);

    //add new segment to the snake
    var newSegment = new SnakeSegment(newX, newY, this.head.dx, this.head.dy);
    this.segmentArray.push(newSegment);
  }
}

//Food Class
function Food() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  c.fillStyle = '#ff6150';

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
    c.fill();
  }

}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  snake.update();
  food.draw();
  if (isFoodEaten(snake.segmentArray[0], food)) {
    snake.append(food.x, food.y);
    food.x = Math.random() * canvas.width;
    food.y = Math.random() * canvas.height;
    score++;
  }
}

function isFoodEaten(s, f) {
  var xDist = (s.x - f.x);
  var yDist = (s.y - f.y);
  if (Math.abs(xDist) < segmentSize && Math.abs(yDist) < segmentSize) {
    return true;
  }
}



