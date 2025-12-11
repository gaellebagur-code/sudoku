let currentPuzzle = [];
let solution = [];

function createGrid() {
  const grid = document.getElementById('sudoku-grid');
  grid.innerHTML = '';
 
  for (let i = 0; i < 9; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '9';
      input.id = `case${i}-${j}`;
      cell.appendChild(input);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function isValid(board, row, col, num) {

  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
 

  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
 
  let startRow = row - row % 3;
  let startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
 
  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateComplete() {
  let board = Array(9).fill().map(() => Array(9).fill(0));
 
  function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          let numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
          for (let num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
 
  fillBoard(board);
  return board;
}

function createPuzzle(difficulty = 40) {
  const complete = generateComplete();
  solution = complete.map(row => [...row]);
  const puzzle = complete.map(row => [...row]);
 
  let cellsToRemove = difficulty;
  while (cellsToRemove > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }
 
  return puzzle;
}

function loadPuzzle(puzzle) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`case${i}-${j}`);
      if (puzzle[i][j] !== 0) {
        input.value = puzzle[i][j];
        input.readOnly = true;
      } else {
        input.value = '';
        input.readOnly = false;
      }
    }
  }
}

function checkSolution() {
  const message = document.getElementById('message');
  let isCorrect = true;
 
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`case${i}-${j}`);
      const value = parseInt(input.value) || 0;
      if (value !== solution[i][j]) {
        isCorrect = false;
        break;
      }
    }
    if (!isCorrect) break;
  }
 
  if (isCorrect) {
    message.textContent = '🎉 Bravo ! La solution est correcte !';
    message.className = 'success';
  } else {
    message.textContent = '❌ La solution n\'est pas correcte. Réessayez !';
    message.className = 'error';
  }
}

function autoSolve() {
  loadPuzzle(solution);
  const message = document.getElementById('message');
  message.textContent = '✅ Grille résolue !';
  message.className = 'success';
}

function newGame() {
  const message = document.getElementById('message');
  message.textContent = '';
  currentPuzzle = createPuzzle(40);
  loadPuzzle(currentPuzzle);
}

createGrid();
newGame();

document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('check-solution').addEventListener('click', checkSolution);
document.getElementById('solve').addEventListener('click', autoSolve);