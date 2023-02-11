const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
const puzzles = require("../controllers/puzzle-strings.js");
let solver;

const exampleBoard = [
  [".", ".", "9", ".", ".", "5", ".", "1", "."],
  ["8", "5", ".", "4", ".", ".", ".", ".", "2"],
  ["4", "3", "2", ".", ".", ".", ".", ".", "."],
  ["1", ".", ".", ".", "6", "9", ".", "8", "3"],
  [".", "9", ".", ".", ".", ".", ".", "6", "."],
  ["6", "2", ".", "7", "1", ".", ".", ".", "9"],
  [".", ".", ".", ".", ".", ".", "1", "9", "4"],
  ["5", ".", ".", ".", ".", "4", ".", "3", "7"],
  [".", "4", ".", "3", ".", ".", ".", ".", "."],
];

suite("UnitTests", () => {
  suiteSetup((done) => {
    solver = new SudokuSolver();
    done();
  });

  suite("Test valid puzzle string", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      puzzles.puzzlesAndSolutions.map((elem) => {
        assert.equal(solver.validateLength(elem[0]), true);
      });

      done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
      const invalidPuzzleString = "1234......234234....xxxx";

      assert.equal(solver.validateLength(invalidPuzzleString), false);

      done();
    });

    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      const invalidPuzzleString = "1234......234234......";

      assert.equal(solver.validateLength(invalidPuzzleString), false);

      done();
    });
  });

  suite("Test row placement", () => {
    test("Logic handles a valid row placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a3";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "9";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 2);
      assert.equal(solver.checkRowPlacement(board, row, column, value), true);

      done();
    });

    test("Logic handles an invalid row placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a3";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "1";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 2);
      assert.equal(solver.checkRowPlacement(board, row, column, value), false);

      done();
    });
  });

  suite("Test column placement", () => {
    test("Logic handles a valid column placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a3";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "7";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 2);
      assert.equal(solver.checkColPlacement(board, row, column, value), true);

      done();
    });

    test("Logic handles an invalid column placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a1";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "6";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 0);
      assert.equal(solver.checkRowPlacement(board, row, column, value), true);

      done();
    });
  });

  suite("Test region placement", () => {
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a1";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "7";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 0);
      assert.equal(
        solver.checkRegionPlacement(board, row, column, value),
        true
      );

      done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";
      const board = solver.transformToBoard(puzzleString);
      const coordinate = "a1";
      const row = solver.getRowNumber(coordinate[0]);
      const column = solver.getColumnNumber(coordinate[1]);
      const value = "3";

      assert.deepEqual(board, exampleBoard);
      assert.equal(row, 0);
      assert.equal(column, 0);
      assert.equal(
        solver.checkRegionPlacement(board, row, column, value),
        false
      );

      done();
    });
  });

  suite("Test solve puzzle", () => {
    test("Valid puzzle strings pass the solver", (done) => {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.....";

      assert.equal(solver.validateLength(puzzleString), true);
      assert.equal(solver.validateCharacters(puzzleString), true);

      done();
    });

    test("Invalid puzzle strings fail the solver", (done) => {
      const puzzleWithInvalidCharacters =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3....x";
      const puzzleWithInvalidLength =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.......";

      assert.equal(
        solver.validateCharacters(puzzleWithInvalidCharacters),
        false
      );
      assert.equal(solver.validateLength(puzzleWithInvalidLength), false);

      done();
    });

    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
      puzzles.puzzlesAndSolutions.map((elem) => {
        assert.equal(solver.solve(elem[0]), elem[1]);
      });

      done();
    });
  });
});
