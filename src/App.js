import React from 'react';
import { ComputerPlayer } from './ComputerPlayer';

import { BOARD_MARKER, DIFFICULTY, PLAYER } from './constants';

import { DifficultySelection } from './DifficultySelection';
import { FirstPlayerSelection } from './FirstPlayerSelection';
import { StalemateDisplay } from './StalemateDisplay';
import { TicTacToeBoard } from './TicTacToeBoard';
import { WinnerDisplay } from './WinnerDisplay';


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
