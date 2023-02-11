const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST /api/solve => Solve a puzzle", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      const reqBody = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };
      chai
        .request(server)
        .post("/api/solve")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.property(
            res.body,
            "solution",
            "response should have solution"
          );
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Required field missing" },
            "response should return Required field(s) missing"
          );
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      const reqBody = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6xx",
      };

      chai
        .request(server)
        .post("/api/solve")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Invalid characters in puzzle" },
            "response should return Invalid characters in puzzle"
          );
          done();
        });
    });

    test("Solve a puzzle with incorrect length", (done) => {
      const reqBody = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6",
      };
      chai
        .request(server)
        .post("/api/solve")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Expected puzzle to be 81 characters long" },
            "response should return Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", (done) => {
      const reqBody = {
        puzzle:
          "..9..5.1.85.4....2431......1...69.83.9.....6.62.71...9......1945....4.37.4.4..6..",
      };

      chai
        .request(server)
        .post("/api/solve")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Puzzle cannot be solved" },
            "response should return Puzzle cannot be solved"
          );
          done();
        });
    });
  });

  suite("POST /api/check => Check a puzzle placement", () => {
    test("Check a puzzle placement with all fields", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "7",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { valid: true },
            "response should have valid true"
          );
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "6",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.equal(
            res.body.valid,
            false,
            "response should have valid false"
          );
          assert.isArray(
            res.body.conflict,
            "response should have an array of conflict"
          );
          assert.equal(
            res.body.conflict.length,
            1,
            "response should have one conflict"
          );
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "1",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.equal(
            res.body.valid,
            false,
            "response should have valid false"
          );
          assert.isArray(
            res.body.conflict,
            "response should have an array of conflict"
          );
          assert.equal(
            res.body.conflict.length > 1,
            true,
            "response should have > 1 conflict"
          );
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2431......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "1",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.equal(
            res.body.valid,
            false,
            "response should have valid false"
          );
          assert.isArray(
            res.body.conflict,
            "response should have an array of conflict"
          );
          assert.equal(
            res.body.conflict.length,
            3,
            "response should have 3 conflicts"
          );
          done();
        });
    });

    test("Check a puzzle placement with missing required field(s)", (done) => {
      const reqBody = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "1",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Required field(s) missing" },
            "response should return Required field(s) missing"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6x.",
        value: "2",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Invalid characters in puzzle" },
            "response should return Invalid characters in puzzle"
          );
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6....",
        value: "1",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Expected puzzle to be 81 characters long" },
            "response should return Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      const reqBody = {
        coordinate: "a1",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "a",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Invalid value" },
            "response should return Invalid value"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      const reqBody = {
        coordinate: "a",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "1",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Invalid coordinate" },
            "response should return Invalid coordinate"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate and value", (done) => {
      const reqBody = {
        coordinate: "a",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "a",
      };
      chai
        .request(server)
        .post("/api/check")
        .send(reqBody)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.deepEqual(
            res.body,
            { error: "Invalid value" },
            "response should return Invalid value"
          );
          done();
        });
    });
  });
});

