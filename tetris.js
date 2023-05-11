const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let board = [];
let currentPiece;
let score = 0;
let gameInterval;
let isPaused = false;

// Inicializa o tabuleiro
function initBoard() {
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < columns; col++) {
      board[row][col] = 0;
    }
  }
}

// Desenha o tabuleiro e as peças
function draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
  drawBoard();
  currentPiece.draw();
}

// Desenha o tabuleiro
function drawBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (board[row][col]) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(col * scale, row * scale, scale, scale);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(col * scale, row * scale, scale, scale);
      }
    }
  }
}

// Classe Piece
class Piece {
  constructor(shape) {
    this.shape = shape;
    this.row = 0;
    this.col = Math.floor(columns / 2) - 1;
  }

  draw() {
    ctx.fillStyle = 'red';
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          ctx.fillRect((this.col + col) * scale, (this.row + row) * scale, scale, scale);
          ctx.strokeStyle = 'white';
          ctx.strokeRect((this.col + col) * scale, (this.row + row) * scale, scale, scale);
        }
      }
    }
  }
}

// Peças do Tetris
const pieces = [
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 1, 1],
  ],
];

// Cria uma nova peça
function newPiece() {
  const shape = pieces[Math.floor(Math.random() * pieces.length)];
  currentPiece = new Piece(shape);
}

// Movimenta a peça para baixo
function moveDown() {
  if (!collision(1, 0)) {
    currentPiece.row++;
  } else {
    mergePiece();
    newPiece();
    if (collision(0, 0)) {
      gameOver();
    }
  }
}

// Movimenta a peça para os lados
function moveSide(dir) {
  if (!collision(0, dir)) {
    currentPiece.col += dir;
  }
}

// Rotaciona a peça
function rotate() {
  const temp = currentPiece.shape;
  currentPiece.shape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
  if (collision(0, 0)) {
    currentPiece.shape = temp;
  }
}

// Verifica colisão
function collision(rowOffset, colOffset) {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col] && (board[currentPiece.row + row + rowOffset] && board[currentPiece.row + row + rowOffset][currentPiece.col + col + colOffset]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Mescla a peça com o tabuleiro
function mergePiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        board[currentPiece.row + row][currentPiece.col + col] = 1;
      }
    }
  }
  removeFullLines();
}

// Remove linhas completas
function removeFullLines() {
  let linesRemoved = 0;
  outer: for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < columns; col++) {
      if (!board[row][col]) {
        continue outer;
      }
    }
    board.splice(row, 1);
    board.unshift(Array(columns).fill(0));
    linesRemoved++;
  }
  updateScore(linesRemoved);
}

// Atualiza a pontuação
function updateScore(linesRemoved) {
  score += linesRemoved * 10;
  document.getElementById('score').innerText = score;
}

// Fim de jogo
function gameOver() {
  clearInterval(gameInterval);
  alert('Fim de jogo! Sua pontuação: ' + score);
  initBoard();
  newPiece();
  score = 0;
  updateScore(0);
}

// Event listeners
document.getElementById('startButton').addEventListener('click', () => {
  if (!gameInterval) {
    gameInterval = setInterval(() => {
      if (!isPaused) {
        moveDown();
        draw();
      }
    }, 500);
  }
});

document.getElementById('pauseButton').addEventListener('click', () => {
  isPaused = !isPaused;
});

document.addEventListener('keydown', (e) => {
  if (!isPaused) {
    if (e.key === 'ArrowDown') {
      moveDown();
    } else if (e.key === 'ArrowLeft') {
      moveSide(-1);
    } else if (e.key === 'ArrowRight') {
      moveSide(1);
    } else if (e.key === 'ArrowUp') {
      rotate();
    }
    draw();
  }
});

// Inicializa o jogo
initBoard();
newPiece();
draw();