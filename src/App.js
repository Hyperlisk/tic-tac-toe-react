import React from 'react';

import { BOARD_MARKER, DIFFICULTY, PLAYER } from './constants';
import { ConfirmationButton, DisplayBanner, DisplayBannerContainer } from './shared';
import { oneOf } from './utils';

import { DifficultySelection } from './DifficultySelection';
import { FirstPlayerSelection } from './FirstPlayerSelection';
import { TicTacToeBoard } from './TicTacToeBoard';


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
  for (let i = 0;i < possibleWins.length;i++) {
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
      0
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

class ComputerPlayer extends React.Component {
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
      2000
    );
  }

  render() {
    return null;
  }
}


function WinnerDisplay(props) {
  const { board, winner, onPlayAgainClicked } = props;
  return (
    <DisplayBannerContainer>
      <TicTacToeBoard board={board} playerTurn={winner} />
      <DisplayBanner>
        <div>{winner} wins!</div>
        <ConfirmationButton onClick={onPlayAgainClicked}>Play Again</ConfirmationButton>
      </DisplayBanner>
    </DisplayBannerContainer>
  );
}

function StalemateDisplay(props) {
  const { board, playerTurn, onPlayAgainClicked } = props;
  return (
    <DisplayBannerContainer>
      <TicTacToeBoard board={board} playerTurn={playerTurn} />
      <DisplayBanner>
        <div>Stalemate!</div>
        <ConfirmationButton onClick={onPlayAgainClicked}>Play Again</ConfirmationButton>
      </DisplayBanner>
    </DisplayBannerContainer>
  );
}

const SCREENS = {
  DIFFICULTY_SELECTION: 0,
  FIRST_PLAYER_SELECTION: 1,
  IN_GAME: 2,
  DISPLAY_WINNER: 3,
  DISPLAY_STALEMATE: 4,
};

class App extends React.Component {

  getInitialState() {
    return {
      board: null,
      firstPlayer: PLAYER.HUMAN,
      playerTurn: PLAYER.HUMAN,
      screen: SCREENS.DIFFICULTY_SELECTION,
      selectedDifficulty: DIFFICULTY.BEATABLE,
    };
  }

  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getXPlayer() {
    return this.state.firstPlayer;
  }

  checkForWin(board) {
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
    for (let i = 0;i < possibleWins.length;i++) {
      const [
        [rowA, colA],
        [rowB, colB],
        [rowC, colC],
      ] = possibleWins[i];
      const maybeWinner = board[rowA][colA];
      if (maybeWinner === BOARD_MARKER._) {
        // Not a player, so not a win. Keep looking.
        continue;
      }
      if (maybeWinner === board[rowB][colB] && maybeWinner === board[rowC][colC]) {
        // This player also has the other necessary squares. They won!
        return maybeWinner;
      }
    }
    return BOARD_MARKER._;
  }

  selectSquare(selectedRowIndex, selectedColIndex) {
    const { board, playerTurn } = this.state;

    const marker = playerTurn === this.getXPlayer() ? BOARD_MARKER.X : BOARD_MARKER.O;
    // Create a new board with new arrays containing the board state.
    // We only replace the single square that was selected.
    const updatedBoard = board.map(
      (row, rowIndex) =>
        row.map(
          (square, squareIndex) => {
            if (rowIndex === selectedRowIndex && squareIndex === selectedColIndex) {
              return marker;
            } else {
              return square;
            }
          }
        )
      );
    const winningPlayer = this.checkForWin(updatedBoard);
    const hasStalemate = updatedBoard.every(row => row.every(marker => marker !== BOARD_MARKER._));
    // If we have a winner move to the display winner screen.
    const nextScreen =
      winningPlayer !== BOARD_MARKER._
        ? SCREENS.DISPLAY_WINNER
        : hasStalemate
          ? SCREENS.DISPLAY_STALEMATE
          : SCREENS.IN_GAME;

    this.setState({
      board: updatedBoard,
      // Switch whose turn it is, unless there was a winner.
      playerTurn:
        winningPlayer === BOARD_MARKER._
          // There is no winner yet, switch turns.
          ? playerTurn === PLAYER.HUMAN
            ? PLAYER.COMPUTER
            : PLAYER.HUMAN
          // There is a winner, do not change whose turn it is.
          : playerTurn,
      screen: nextScreen,
    });
  }

  onDifficultySelected = difficultyLevel => {
    this.setState({
      // Move us to the first player selection screen.
      screen: SCREENS.FIRST_PLAYER_SELECTION,
      // Make sure we set the proper difficulty level that was selected.
      selectedDifficulty: difficultyLevel,
    });
  };

  onFirstPlayerSelected = firstPlayer => {
    this.setState({
      // Initialize an empty board.
      board: [
        [BOARD_MARKER._, BOARD_MARKER._, BOARD_MARKER._],
        [BOARD_MARKER._, BOARD_MARKER._, BOARD_MARKER._],
        [BOARD_MARKER._, BOARD_MARKER._, BOARD_MARKER._],
      ],
      // Keep track of who is who is X.
      firstPlayer: firstPlayer,
      // Set the current player's turn to be the one selected.
      playerTurn: firstPlayer,
      // Move us to the actual game.
      screen: SCREENS.IN_GAME,
    });
  };

  onHumanSquareSelected = (selectedRowIndex, selectedColIndex) => {
    const { board, playerTurn } = this.state;

    if (playerTurn !== PLAYER.HUMAN) {
      // We only allow selecting squares on the human's turn. Ignore this one.
      return;
    }

    if (board[selectedRowIndex][selectedColIndex] !== BOARD_MARKER._) {
      // An invalid square was selected, just ignore it.
      return;
    }

    this.selectSquare(selectedRowIndex, selectedColIndex);
  };

  onComputerSquareSelected = (selectedRowIndex, selectedColIndex) => {
    const { board, playerTurn } = this.state;

    if (playerTurn !== PLAYER.COMPUTER) {
      // Something weird has happend. Ignore this one.
      return;
    }

    if (board[selectedRowIndex][selectedColIndex] !== BOARD_MARKER._) {
      // An invalid square was selected, throw an error because something has gone very wrong.
      throw new Error('The computer picked a bad square somehow.');
    }

    this.selectSquare(selectedRowIndex, selectedColIndex);
  };

  onPlayAgainClicked = () => {
    this.setState(this.getInitialState());
  };

  render() {
    const { board, playerTurn, screen, selectedDifficulty } = this.state;

    switch (screen) {
      case SCREENS.DIFFICULTY_SELECTION:
        return (
          <DifficultySelection onDifficultySelected={this.onDifficultySelected} />
        );

      case SCREENS.FIRST_PLAYER_SELECTION:
        return (
          <FirstPlayerSelection onFirstPlayerSelected={this.onFirstPlayerSelected} />
        );

      case SCREENS.IN_GAME:
        const currentPlayerMarker = playerTurn === this.getXPlayer() ? BOARD_MARKER.X : BOARD_MARKER.O;
        return (
          <>
            <TicTacToeBoard
              board={board}
              playerTurn={playerTurn}
              onSquareClicked={this.onHumanSquareSelected}
            />
            {playerTurn === PLAYER.COMPUTER && (
              <ComputerPlayer
                board={board}
                difficulty={selectedDifficulty}
                marker={currentPlayerMarker}
                onSquareSelected={this.onComputerSquareSelected}
              />
            )}
          </>
        );

      case SCREENS.DISPLAY_WINNER:
        const winner = playerTurn === this.getXPlayer() ? BOARD_MARKER.X : BOARD_MARKER.O;
        return (
          <WinnerDisplay
            board={board}
            playerTurn={playerTurn}
            winner={winner}
            onPlayAgainClicked={this.onPlayAgainClicked}
          />
        );

      case SCREENS.DISPLAY_STALEMATE:
        return (
          <StalemateDisplay
            board={board}
            playerTurn={playerTurn}
            onPlayAgainClicked={this.onPlayAgainClicked}
          />
        );

      default:
        throw new Error(`Unkown screen: ${screen}`);
    }
  }
}

export default App;
