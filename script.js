const SOLUTION = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

let currentGrid = null;
let initialGrid = null;

function generateSudoku(level) {
  let holes = level === "easy" ? 30 : level === "medium" ? 45 : 60;
  const grid = SOLUTION.map(row => [...row]);

  while (holes > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (grid[r][c] !== 0) {
      grid[r][c] = 0;
      holes--;
    }
  }

  currentGrid = grid;
  initialGrid = grid.map(row => [...row]);
  return grid;
}

function afficherGrille(grille) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.getElementById(`case${i}-${j}`);
      input.classList.remove("fixe", "highlight-error");

      if (grille[i][j] !== 0) {
        input.value = grille[i][j];
        input.readOnly = true;
        input.classList.add("fixe");
      } else {
        input.value = "0";
        input.readOnly = false;
      }
    }
  }
}

function readGridFromInputs() {
  const grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      const val = document.getElementById(`case${i}-${j}`).value;
      grid[i][j] = val ? parseInt(val) : 0;
    }
  }
  return grid;
}

function solveSudoku(grid) {
  function isValid(row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }

    const sr = row - (row % 3);
    const sc = col - (col % 3);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[sr + r][sc + c] === num) return false;
      }
    }
    return true;
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValid(r, c, n)) {
              grid[r][c] = n;
              if (solve()) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return grid;
}

function verifierMaSolution() {
  const grille = readGridFromInputs();
  const msg = document.getElementById("message");

  document.querySelectorAll("#sudoku-grid input").forEach(i =>
    i.classList.remove("highlight-error")
  );

  let erreur = false;

  for (let i = 0; i < 9; i++) {
    const seen = {};
    for (let j = 0; j < 9; j++) {
      const val = grille[i][j];
      if (val >= 1 && val <= 9) {
        if (seen[val] !== undefined) {
          erreur = true;
          document.getElementById(`case${i}-${j}`).classList.add("highlight-error");
          document.getElementById(`case${i}-${seen[val]}`).classList.add("highlight-error");
        } else {
          seen[val] = j;
        }
      }
    }
  }

  for (let j = 0; j < 9; j++) {
    const seen = {};
    for (let i = 0; i < 9; i++) {
      const val = grille[i][j];
      if (val >= 1 && val <= 9) {
        if (seen[val] !== undefined) {
          erreur = true;
          document.getElementById(`case${i}-${j}`).classList.add("highlight-error");
          document.getElementById(`case${seen[val]}-${j}`).classList.add("highlight-error");
        } else {
          seen[val] = i;
        }
      }
    }
  }

  if (!erreur) {
    msg.textContent = "✅ Aucun doublon détecté 🎉";
    msg.className = "success";
  } else {
    msg.textContent = "❌ Des doublons ont été trouvés 🙈";
    msg.className = "error";
  }
}

document.getElementById("level-easy").addEventListener("click", () => {
  afficherGrille(generateSudoku("easy"));
  message.textContent = "Easy mode 😊";
});

document.getElementById("level-medium").addEventListener("click", () => {
  afficherGrille(generateSudoku("medium"));
  message.textContent = "Medium mode 😏";
});

document.getElementById("level-hard").addEventListener("click", () => {
  afficherGrille(generateSudoku("hard"));
  message.textContent = "Hard mode 😈";
});

document.getElementById("new-game").addEventListener("click", () => {
  afficherGrille(initialGrid || generateSudoku("medium"));
  message.textContent = "New game 🎲";
});

document.getElementById("solve").addEventListener("click", () => {
  const grid = readGridFromInputs();
  solveSudoku(grid);
  afficherGrille(grid);
  message.textContent = "Solved 😎";
});

document.getElementById("check-solution").addEventListener("click", () => {
  verifierMaSolution();
});

document.querySelectorAll("#sudoku-grid input").forEach(input => {
  input.addEventListener("input", e => {
    if (!/^[1-9]$/.test(e.target.value)) e.target.value = "0";
  });
});

afficherGrille(generateSudoku("easy"));
