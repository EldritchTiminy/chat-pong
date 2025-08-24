const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // "2d" means we're drawing in 2D
// The .getContext method above returns a drawing context on the canvas.
// The "2d" input creates a CanvasRenderingContext2D object representing a two-dimensional rendering context.
// Syntax: <HTMLCanvasElement>.getContext(contextType)
// Note: ctx will be our paintbrush for drawing.

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); // CanvasRenderingContext2D.arc() is a method of the
  // Canvas 2D API. It adds a circular arc to the current sub-path.
  // Syntax: {2DObject}.arc(x, y, radius, startAngle, endAngle, counterclockwise(optional))
  // This creates a circular arc centered at (x, y) with the specified radius.
  // startAngle is measured from the positive x-axis.
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// Paddle properties
const paddleHeight = 100;
const paddleWidth = 10;

// Player paddle (left side)
let playerY = canvas.height / 2 - paddleHeight / 2;

// AI paddle (right side)
let aiY = canvas.height / 2 - paddleHeight / 2;

// Score Variables
let playerScore = 0;
let aiScore = 0;

function drawScore () {
  ctx.font = "30px Arial";
  ctx.fillText(playerScore, canvas.width / 4, 50);
  ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.width / 2;
  //ballSpeedX *= -1; // Sends ball to loser - according to ChatGPT.
  // This actually sends the ball back to the winner of the round.
}

function drawPaddle(x, y) {
  ctx.fillStyle = "white";// CanvasRenderingContext2D.fillStyle is a property of the 
  // canvas 2D API. It specifies the color, gradient, or pattern to use inside shapes.
  // The default style is "black"
  // Syntax: {CanvasRenderingContext2DObject}.fillStyle = <input>;
  // The following are accepted in the place of <input>:
  // - A string parsed as CSS <color> value.
  // - A CanvasGradient object (a linear or radial gradient).
  // - A CanvasPattern object (a repeating image).
  ctx.fillRect(x, y, paddleWidth, paddleHeight); // CanvasRenderingContext2D.fillRect() is a method of the
  // canvas 2D API. It draws a rectangle that is filled according to the current fillStyle.
  // This method draws directly to the canvas without modifying the current path, so any subsequent fill()
  // or stroke() call will have no effect on it.
  // Syntax: {CanvasRenderingContext2DObject}.fillRect(x, y, width, height)
}

function draw() {
  // Ball
  drawBall();

  // Paddles
  drawPaddle(10, playerY);
  drawPaddle(canvas.width - paddleWidth - 10, aiY);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    playerY -= 20;
  } else if (e.key === "ArrowDown") {
    playerY += 20;
  }
});



function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the screen every time the function is called.
  // Function runs about 60 times per second according to ChatGPT.

  draw();
  drawScore();

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off top/bottom
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY *= -1;
  }

  // Ball hits left paddle
  if (
    ballX - ballRadius < paddleWidth + 10 &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Bal hits right paddle
  if (
    ballX + ballRadius > canvas.width - paddleWidth - 10 &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Check if ball goes off screen
  if (ballX - ballRadius < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }

  const aiSpeed = 3;
  if (aiY + paddleHeight / 2 < ballY) {
    aiY += aiSpeed;
  } else {
    aiY -= aiSpeed;
  }

  requestAnimationFrame(update); // This calls the function recursively.
  // This method tells the browser that you wish to perform an animation.
  // It requests the browser to call a user-supplied callback function before the next repaint.
  // The frequency of calls to the callback function will generall match the display refresh rate.
}

update();