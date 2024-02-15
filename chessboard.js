// chessboard.js

// Define the chessboard dimensions
const boardSize = 8;

// Define chess pieces
var pieces = [
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
];

// Function to create the chessboard --------------------------------------------------------
function createChessboard(pieces) {
  const chessboard = document.getElementById("chessboard");

  // Create notations for rows (8-1)
  const rowNotation = document.createElement("div");
  rowNotation.classList.add("notation");
  for (let i = boardSize; i > 0; i--) {
    const span = document.createElement("span");
    span.textContent = i;
    rowNotation.appendChild(span);
  }
  chessboard.appendChild(rowNotation);

  // Create notations for columns (a-h)
  const columnNotation = document.createElement("div");
  columnNotation.classList.add("column-notation");
  for (let i = 0; i < boardSize; i++) {
    const span = document.createElement("span");
    span.textContent = String.fromCharCode(97 + i); // ASCII code for 'a' is 97
    columnNotation.appendChild(span);
  }
  chessboard.appendChild(columnNotation);

  // Create the chessboard grid with pieces
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const square = document.createElement("div");
      square.classList.add("square", (row + col) % 2 === 0 ? "white" : "black");

      // // Add chess piece character
      // if (pieces[row][col] !== "") {
      //   const piece = document.createElement("div");
      //   piece.classList.add("piece");
      //   piece.textContent = pieces[row][col];
      //   square.appendChild(piece);
      // }

      // Add chess piece image
      const piece = pieces[row] && pieces[row][col] ? pieces[row][col] : "";
      if (piece !== "") {
        const pieceImg = document.createElement("img");
        const pieceLowerCase = piece.toLowerCase();
        pieceImg.src = `assets/pieces/${pieceLowerCase}${
          piece === pieceLowerCase ? "b" : "w"
        }.png`; // Construct image URL
        pieceImg.alt = piece;
        pieceImg.classList.add("piece");
        square.appendChild(pieceImg);
      }

      chessboard.appendChild(square);
    }
  }
}

// Function to highlight the specified box --------------------------------------------------------
function highlightBox() {
  const inputBox = document.getElementById("inputBox").value.toLowerCase();
  const chessboard = document.getElementById("chessboard");
  const squares = chessboard.getElementsByClassName("square");

  // Reset previous highlights
  Array.from(squares).forEach((square) => {
    square.classList.remove("highlight");
  });

  // Highlight the specified box
  const regex = /^([a-h])([1-8])$/;
  const match = inputBox.match(regex);
  if (match) {
    const colIndex = match[1].charCodeAt(0) - 97;
    const rowIndex = boardSize - parseInt(match[2]);
    const squareIndex = rowIndex * boardSize + colIndex;

    if (squareIndex >= 0 && squareIndex < squares.length) {
      squares[squareIndex].classList.add("highlight");
    }
  }
}

// Function to clear all pieces from the chessboard ------------------------------------------
function clearPieces() {
  const chessboard = document.getElementById("chessboard");
  const squares = chessboard.getElementsByClassName("square");

  // Clear all pieces from the chessboard
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerHTML = "";
  }
}

// Function to move a chess piece --------------------------------------------------------
function movePiece() {
  const inputMove = document.getElementById("inputMove").value.toLowerCase();
  const chessboard = document.getElementById("chessboard");
  const squares = chessboard.getElementsByClassName("square");

  // Reset previous highlights
  Array.from(squares).forEach((square) => {
    square.classList.remove("highlight");
  });

  // Parse the move input
  const moveRegex = /^([a-h])([1-8])\s* \s*([a-h])([1-8])$/;
  const moveMatch = inputMove.match(moveRegex);

  if (moveMatch) {
    const startCol = moveMatch[1].charCodeAt(0) - 97;
    const startRow = boardSize - parseInt(moveMatch[2]);
    const startSquareIndex = startRow * boardSize + startCol;

    const endCol = moveMatch[3].charCodeAt(0) - 97;
    const endRow = boardSize - parseInt(moveMatch[4]);
    const endSquareIndex = endRow * boardSize + endCol;

    // Check if the start and end square indices are valid
    if (
      startSquareIndex >= 0 &&
      startSquareIndex < squares.length &&
      endSquareIndex >= 0 &&
      endSquareIndex < squares.length
    ) {
      // orders matter, Update pieces array first, then move the piece visually
      // Update the pieces array
      const piece = pieces[startRow][startCol];
      pieces[startRow][startCol] = "";
      pieces[endRow][endCol] = piece;

      // Move the piece in the visual representation
      squares[endSquareIndex].innerHTML = squares[startSquareIndex].innerHTML;
      squares[startSquareIndex].innerHTML = "";

      // Highlight the end square
      squares[endSquareIndex].classList.add("highlight");

      // // Update the chessboard display
      // updateChessboard(pieces);
      getFENPosition(pieces);
    }
  }
}

// Function to convert fen to array and vice versa --------------------------------------------------------
function fenToArray(fen) {
  // const pieces = [];
  const rows = fen.split(" ")[0].split("/");

  for (let i = 0; i < 8; i++) {
    pieces[i] = [];
    let colIndex = 0;

    for (let j = 0; j < rows[i].length; j++) {
      const char = rows[i][j];

      if (isNaN(char)) {
        pieces[i][colIndex++] = char;
      } else {
        colIndex += parseInt(char);
      }
    }
  }

  return pieces;
}

function arrayToFen(pieces) {
  let fen = "";

  for (let i = 0; i < 8; i++) {
    let emptyCount = 0;

    for (let j = 0; j < 8; j++) {
      const piece = pieces[i][j];

      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }

        fen += piece;
      }
    }

    if (emptyCount > 0) {
      fen += emptyCount;
    }

    if (i < 7) {
      fen += "/";
    }
  }

  return fen;
}

// Function to set FEN position ----------------------------------------------------------
function setFENPosition() {
  const inputFEN = document.getElementById("inputFEN").value;
  pieces = fenToArray(inputFEN); // Update the global pieces array
  updateChessboard(pieces);
}

// Function to get FEN notation ----------------------------------------------------------
function getFENPosition() {
  const chessboard = pieces;
  const fenNotation = arrayToFen(chessboard);
  console.log("Current FEN Notation: " + fenNotation);
}

// Function to update the chessboard -----------------------------------------------------
function updateChessboard(chessboard) {
  const chessboardDiv = document.getElementById("chessboard");
  chessboardDiv.innerHTML = ""; // Clear the existing chessboard
  createChessboard(chessboard); // Recreate the chessboard with the new position
}

createChessboard(pieces);
