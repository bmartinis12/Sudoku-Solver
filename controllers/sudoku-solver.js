class SudokuSolver {
  validateLength(puzzleString) {
    return typeof puzzleString === "string" && puzzleString.length === 81;
  }

  validateCharacters(puzzleString) {
    const regex = /^[\d\.]{81}$/;
    const isValid = regex.test(puzzleString);
    return isValid;
  }

  validateCoordinate(coordinate) {
    const regex = /^[a-iA-I][1-9]$/;
    const isValid = regex.test(coordinate);
    return isValid;
  }

  validateValue(value) {
    const regex = /\b[1-9]\b/;
    const isValid = regex.test(+value);
    return isValid;
  }

  checkRowPlacement(board, row, column, value) {
    if (board[row][column] === String(value)) return true;
    return !board[row].includes(value);
  }

  checkColPlacement(board, row, column, value) {
    if (board[row][column] === String(value)) return true;
    return !board.some((rowString) => rowString[column] === value);
  }

  checkRegionPlacement(board, row, column, value) {
    if (board[row][column] === String(value)) return true;

    const startRegionRow = Math.floor(row / 3) * 3;
    const startRegionColumn = Math.floor(column / 3) * 3;

    for (let i = startRegionRow; i < startRegionRow + 3; i++) {
      for (let j = startRegionColumn; j < startRegionColumn + 3; j++) {
        if (board[i][j] === value) return false;
      }
    }

    return true;
  }

  solve(puzzleString) {
    const board = this.transformToBoard(puzzleString);

    if (this.fillInNumbers(board, 0, 0)) {
      return board.flat().join("");
    }

    return "";
  }

  getRowNumber(rowCharacter) {
    const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    return characters.findIndex(
      (character) => character === rowCharacter.toLowerCase()
    );
  }

  getColumnNumber(column) {
    return +column - 1;
  }

  transformToBoard(puzzleString) {
    const sudokuSize = 9;
    const board = [];
    const puzzleArr = puzzleString.split("");

    for (let i = 0; i < sudokuSize; i++) {
      board.push(puzzleArr.slice(sudokuSize * i, (i + 1) * sudokuSize));
    }

    return board;
  }

  fillInNumbers(board, row, column) {
    if (row === 8 && column === 9) {
      return true;
    }

    if (column === 9) {
      row += 1;
      column = 0;
    }

    if (board[row][column] !== ".") {
      return this.fillInNumbers(board, row, column + 1);
    }

    for (let value = 1; value <= 9; value++) {
      if (this.isSafe(board, row, column, String(value))) {
        board[row][column] = String(value);

        if (this.fillInNumbers(board, row, column + 1)) {
          return true;
        }
      }

      board[row][column] = ".";
    }

    return false;
  }

  isSafe(board, i, j, value) {
    const isRegionPlaceable = this.checkRegionPlacement(board, i, j, value);
    const isColPlacementValid = this.checkColPlacement(board, i, j, value);
    const isRowPlacementValid = this.checkRowPlacement(board, i, j, value);

    return isRegionPlaceable && isColPlacementValid && isRowPlacementValid;
  }
}

module.exports = SudokuSolver;
