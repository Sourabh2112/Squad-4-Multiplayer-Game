import Board from '../types/Board';

let board: Board = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
];
let clickedTile: [null | number, null | number, null | string] = [
  null,
  null,
  null,
];
let win = false;
/** check for draw */
function highlightWin(
  i: number,
  j: number,
  x = clickedTile[0],
  y = clickedTile[1]
) {
  if (!x || !y) return;
  for (let a = 0; a < 4; a++)
    board[x + a * i][y + a * j] = '9-' + clickedTile[2];
  win = true;
}

function checkWinHorizontal() {
  if (!clickedTile[0]) return;
  let count = 0;
  for (const [index, tile] of board[clickedTile[0]].entries()) {
    if (tile == clickedTile[2]) count++;
    else count = 0;
    if (count == 4) {
      console.log(clickedTile[2] + ' Won Horizontally');
      highlightWin(0, -1, undefined, index);
    }
  }
}

function checkWinVertical() {
  if (!clickedTile[1]) return;
  let count = 0;
  for (const tile of board) {
    if (tile[clickedTile[1]] == clickedTile[2]) count++;
    else count = 0;
    if (count == 4) {
      console.log(clickedTile[2] + ' Won Vertically');
      highlightWin(1, 0);
    }
  }
}

function checkWinLeftRightDiagonal() {
  let count = 0;
  let x = clickedTile[0];
  let y = clickedTile[1];
  if (!x || !y) return;
  let minOfTwoCoords = Math.min(x, y);
  x = x - minOfTwoCoords;
  y = y - minOfTwoCoords;
  while (x < 6 && y < 7) {
    board[x][y] == clickedTile[2] ? count++ : (count = 0);
    if (count == 4) {
      console.log(clickedTile[2] + ' Won LtR Diagonal Top');
      highlightWin(-1, -1, x, y);
    }
    x++;
    y++;
  }
}

function checkWinLeftRightDiagonalBottom() {
  let count = 0;
  let x = clickedTile[0];
  let y = clickedTile[1];
  if (!x || !y) return;
  if (x + y <= 5) {
    x = x + y;
    y = 0;
  } else {
    x = 5;
    y = x + y - 5;
  }
  while (x >= 0 && y < 7) {
    board[x][y] == clickedTile[2] ? count++ : (count = 0);
    if (count == 4) {
      console.log(clickedTile[2] + ' Won LtR Diagonal Bottom');
      highlightWin(1, -1, x, y);
    }
    x--;
    y++;
  }
}

const gameLogic = {
  checkWin(
    gameBoard: Board,
    checkTile: [number | null, number | null, string | null],
    originalWin: boolean
  ) {
    board = gameBoard;
    clickedTile = checkTile;
    win = originalWin;
    checkWinHorizontal();
    checkWinVertical();
    checkWinLeftRightDiagonal();
    checkWinLeftRightDiagonalBottom();

    return win;
  },
  checkDraw(gameBoard: Board, win: boolean) {
    if (win) return false;
    for (const tile of gameBoard[0]) {
      if (!tile) return false;
    }
    return true;
  },
};

export default gameLogic;
