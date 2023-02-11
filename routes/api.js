"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle: puzzleString, coordinate, value } = req.body;

    if (!puzzleString || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });

    if (!solver.validateLength(puzzleString))
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    if (!solver.validateCharacters(puzzleString))
      return res.json({ error: "Invalid characters in puzzle" });
    if (!solver.validateValue(value))
      return res.json({ error: "Invalid value" });
    if (!solver.validateCoordinate(coordinate))
      return res.json({ error: "Invalid coordinate" });

    const conflict = [];
    const row = solver.getRowNumber(coordinate[0]);
    const column = solver.getColumnNumber(coordinate[1]);
    const board = solver.transformToBoard(puzzleString);

    if (!solver.checkColPlacement(board, row, column, value))
      conflict.push("column");
    if (!solver.checkRowPlacement(board, row, column, value))
      conflict.push("row");
    if (!solver.checkRegionPlacement(board, row, column, value))
      conflict.push("region");

    if (conflict.length) return res.json({ valid: false, conflict });

    res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzleString = req.body.puzzle;

    if (!puzzleString) return res.json({ error: "Required field missing" });

    if (!solver.validateLength(puzzleString))
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    if (!solver.validateCharacters(puzzleString))
      return res.json({ error: "Invalid characters in puzzle" });
    const solution = solver.solve(puzzleString);
    if (!solution) return res.json({ error: "Puzzle cannot be solved" });

    res.json({ solution });
  });
};
