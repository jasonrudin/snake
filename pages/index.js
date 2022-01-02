import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Snake</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas className="border-2"></canvas>
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
var segmentSize = 10;
var speed = 2;
var dx = speed;
var dy = 0;

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

    window.addEventListener('keydown', function(event){
      switch(event.code){
        case "KeyA":
        case "ArrowLeft":
          dx = -speed;
          dy = 0;
          break;
          case "KeyD":
        case "ArrowRight":
          dx = speed;
          dy = 0;
          break;
          case "KeyW":
        case "ArrowUp":
          dy = -speed;
          dx = 0;
          break;
          case "KeyS":
        case "ArrowDown":
          dx = 0;
          dy = speed;
          break;
      }
    });
  }
}

//Snake Class
function Snake(startX, startY) {
  this.x = startX;
  this.y = startY;

  this.xForDrawing = this.x - segmentSize / 2;
  this.yForDrawing = this.y - segmentSize / 2;

  this.draw = function () {
    c.beginPath();
    c.rect(this.xLeftBound, this.yTopBound, segmentSize, segmentSize);
    c.fill();
  }

  this.update = function () {
    this.x += dx;
    this.y += dy;
    this.xLeftBound = this.x - segmentSize / 2;
    this.xRightBound = this.x + segmentSize / 2;
    this.yTopBound = this.y - segmentSize / 2;
    this.yBottomBound = this.y + segmentSize / 2;
    this.checkWallCollision();
    this.draw();
  }

  this.checkWallCollision = function(){
    if(this.xLeftBound <= 0 || this.xRightBound >= canvas.width){
      dx = 0;
    }
    if(this.yTopBound <= 0 || this.yBottomBound >= canvas.height){
      dy = 0;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  snake.update();
}


