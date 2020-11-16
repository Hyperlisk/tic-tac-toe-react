
import React from 'react';

import { BOARD_MARKER, DIFFICULTY } from './constants';
import { oneOf } from './utils';


function selectSquareForBeatableDifficulty(board, marker) {
  // Try and stay out of the human's way.
  // If no space has been played yet, pick a "wall" because that gives the least
  // opportunity to win.
  const isEmptyBoard = board.every(row => row.every(col => col === BOARD_MARKER._));
  if (isEmptyBoard) {
    // Squares not in the corner and not in the center.
    return oneOf([[0, 1], [1, 0], [1, 2], [2, 1]]);
  }

  // Try and stay out of the human's way as much as possible.
  const isHumanMarker = testMarker => testMarker !== BOARD_MARKER._ && testMarker !== marker;
  const wouldBlockHuman = (board, rowIndex, colIndex) => {
    // Check each direction from this square to make sure it's not in the line of a human square.
    const squaresToCheck = [
      [rowIndex - 2, colIndex - 2],
      [rowIndex - 1, colIndex - 1],
      [rowIndex - 2, colIndex],
      [rowIndex - 1, colIndex],
      [rowIndex - 1, colIndex + 1],
      [rowIndex - 2, colIndex + 2],
      [rowIndex, colIndex - 2],
      [rowIndex, colIndex - 1],
      [rowIndex, colIndex + 2],
      [rowIndex, colIndex + 1],
      [rowIndex + 1, colIndex - 1],
      [rowIndex + 2, colIndex - 2],
      [rowIndex + 2, colIndex],
      [rowIndex + 1, colIndex],
      [rowIndex + 1, colIndex + 1],
      [rowIndex + 2, colIndex + 2],
    ];
    return squaresToCheck.some(([testRowIndex, testColIndex]) => {
      const row = board[testRowIndex];
      if (row === undefined) {
        // Thinking about a square that is out of bounds, ignore it.
        return false;
      }
      const square = row[testColIndex];
      if (square === undefined) {
        // Thinking about a square that is out of bounds, ignore it.
        return false;
      }
      return isHumanMarker(square);
    });
  };
  const open = [];
  const unblocking = [];
  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const marker = board[rowIndex][colIndex];
      if (marker === BOARD_MARKER._) {
        open.push([rowIndex, colIndex]);
        if (!wouldBlockHuman(board, rowIndex, colIndex)) {
          unblocking.push([rowIndex, colIndex]);
        }
      }
    });
  });

  if (unblocking.length !== 0) {
    return oneOf(unblocking);
  }

  // We can't really stay out of the way so just pick a random spot.
  return oneOf(open);
}

function selectSquareForUnbeatableDifficulty(board, marker) {
  // Do the opposite of the beatable difficulty. Get in the human's way.
  debugger;
  // Pick the center if it's available.
  if (board[1][1] === BOARD_MARKER._) {
    return [1, 1];
  }

  const isHumanMarker = testMarker => testMarker !== BOARD_MARKER._ && testMarker !== marker;
  // Check if we can win, or of we need to block our opponent.
  const possibleWins = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]],
  ];
  for (let i = 0; i < possibleWins.length; i++) {
    const [
      [rowA, colA],
      [rowB, colB],
      [rowC, colC],
    ] = possibleWins[i];
    const openSpaces = Number(board[rowA][colA] === BOARD_MARKER._) + Number(board[rowB][colB] === BOARD_MARKER._) + Number(board[rowC][colC] === BOARD_MARKER._)
    const mySpaces = Number(board[rowA][colA] === marker) + Number(board[rowB][colB] === marker) + Number(board[rowC][colC] === marker)
    const opponentSpaces = Number(isHumanMarker(board[rowA][colA])) + Number(isHumanMarker(board[rowB][colB])) + Number(isHumanMarker(board[rowC][colC]))
    if (openSpaces === 1 && (mySpaces === 2 || opponentSpaces === 2)) {
      return possibleWins[i].filter(([row, col]) => board[row][col] === BOARD_MARKER._)[0];
    }
  }

  // Try and block as much as possible.
  const getBlockStrength = (board, rowIndex, colIndex) => {
    const squaresToCheck = [
      [rowIndex - 2, colIndex - 2],
      [rowIndex - 1, colIndex - 1],
      [rowIndex - 2, colIndex],
      [rowIndex - 1, colIndex],
      [rowIndex - 1, colIndex + 1],
      [rowIndex - 2, colIndex + 2],
      [rowIndex, colIndex - 2],
      [rowIndex, colIndex - 1],
      [rowIndex, colIndex + 2],
      [rowIndex, colIndex + 1],
      [rowIndex + 1, colIndex - 1],
      [rowIndex + 2, colIndex - 2],
      [rowIndex + 2, colIndex],
      [rowIndex + 1, colIndex],
      [rowIndex + 1, colIndex + 1],
      [rowIndex + 2, colIndex + 2],
    ];
    return squaresToCheck.reduce(
      (acc, [testRowIndex, testColIndex]) => {
        const blocks = !!board[testRowIndex] && !!board[testRowIndex][testColIndex] && isHumanMarker(board[testRowIndex][testColIndex]);
        return blocks ? acc + 1 : acc;
      },
      0,
    );
  };

  let open = [];
  let maxStrength = 0;
  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const marker = board[rowIndex][colIndex];
      if (marker === BOARD_MARKER._) {
        const blockingStrength = getBlockStrength(board, rowIndex, colIndex);
        const entry = [rowIndex, colIndex];
        if (blockingStrength > maxStrength) {
          open = [entry];
          maxStrength = blockingStrength;
        } else if (blockingStrength === maxStrength) {
          open.push(entry);
        }
      }
    });
  });

  // Pick a random spot that block the most.
  return oneOf(open);
}

function selectSquareForDifficulty(difficulty, board, marker) {
  switch (difficulty) {
    case DIFFICULTY.BEATABLE:
      return selectSquareForBeatableDifficulty(board, marker);

    case DIFFICULTY.UNBEATABLE:
      return selectSquareForUnbeatableDifficulty(board, marker);

    default:
      throw new Error(`Unkown difficulty: ${difficulty}`);
  }
}

export class ComputerPlayer extends React.Component {
  // Inject global dependencies rather than just using them.
  // This lets us test much easier despite jest already having some facilities.
  static defaultProps = {
    selectSquareForDifficulty: selectSquareForDifficulty,
    setTimeout: setTimeout,
  };

  componentDidMount() {
    const { board, difficulty, marker, selectSquareForDifficulty, setTimeout, onSquareSelected } = this.props;
    setTimeout(
      () => {
        const [rowIndex, colIndex] = selectSquareForDifficulty(difficulty, board, marker);
        onSquareSelected(rowIndex, colIndex);
      },
      2000,
    );
  }

  render() {
    return null;
  }
}
