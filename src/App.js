import React from 'react';
import styled from 'styled-components';

const TicTacToeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 75vh;
  height: 75vh;
  border: 1px solid #000;
`;

const TicTacToeBoardRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

function getTicTacToeBoardSquareCursor(props) {
  if (props.playerTurn === PLAYER.HUMAN) {
    return 'pointer';
  }
  if (props.playerTurn === PLAYER.COMPUTER) {
    return 'default';
  }
  return 'auto';
}
const TicTacToeBoardSquare = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23vh;
  height: 23vh;
  border: 1px solid #000;
  cursor: ${getTicTacToeBoardSquareCursor};
`;

const DifficultySelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 75vh;
`;

const FirstPlayerSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 75vh;
`;

const ConfirmationButton = styled.button`
  border: 1px outset #33C;
  border-radius: 10px;
  background-color: #55E;
  color: #EEE;
  font-size: 8vh;
  width: 50vh;
  height: 20vh;
`;

const BOARD_MARKER = {
  // Nothing played in the space.
  _: ' ',
  // X played in the space.
  X: 'x',
  // O played in the space.
  O: 'o',
};

class TicTacToeBoard extends React.Component {
  onSquareSelected = e => {
    const { playerTurn } = this.props;

    if (playerTurn !== PLAYER.HUMAN) {
      // Ignore any clicks when it's not the human's turn.
      return;
    }

    const { dataset } = e.target;
    const rowIndex = parseInt(dataset.row, 10);
    const columnIndex = parseInt(dataset.column, 10);

    if (isNaN(rowIndex) || isNaN(columnIndex)) {
      // Something happened to our data, just do nothing.
      return;
    }

    this.props.onSquareSelected(rowIndex, columnIndex);
  };

  render() {
    const { board, playerTurn } = this.props;

    return (
      <TicTacToeBoardContainer>
        {board.map((row, rowIndex) => (
          <TicTacToeBoardRow key={rowIndex}>
            {row.map((square, squareIndex) => (
              <TicTacToeBoardSquare
                key={squareIndex}
                playerTurn={playerTurn}
                onClick={this.onSquareSelected}
                data-row={rowIndex}
                data-column={squareIndex}
              >
                {square}
              </TicTacToeBoardSquare>
            ))}
          </TicTacToeBoardRow>
        ))}
      </TicTacToeBoardContainer>
    );
  }
}

const DIFFICULTY = {
  BEATABLE: 0,
  UNBEATABLE: 1,
};

class DifficultySelection extends React.Component {
  onBeatableClicked = () => {
    this.props.onDifficultySelected(DIFFICULTY.BEATABLE);
  };

  onUnbeatableClicked = () => {
    this.props.onDifficultySelected(DIFFICULTY.UNBEATABLE);
  };

  render() {
    return (
      <DifficultySelectionContainer>
        <h1>Select Difficulty</h1>
        <ConfirmationButton onClick={this.onBeatableClicked}>
          Beatable
        </ConfirmationButton>
        <ConfirmationButton onClick={this.onUnbeatableClicked}>
          Unbeatable
        </ConfirmationButton>
      </DifficultySelectionContainer>
    );
  }
}

const PLAYER = {
  HUMAN: 0,
  COMPUTER: 1,
};

class FirstPlayerSelection extends React.Component {
  onHumanClicked = () => {
    this.props.onFirstPlayerSelected(PLAYER.HUMAN);
  };

  onComputerClicked = () => {
    this.props.onFirstPlayerSelected(PLAYER.COMPUTER);
  };

  render() {
    return (
      <FirstPlayerSelectionContainer>
        <h1>Select First Player</h1>
        <ConfirmationButton onClick={this.onHumanClicked}>
          Human
        </ConfirmationButton>
        <ConfirmationButton onClick={this.onComputerClicked}>
          Computer
        </ConfirmationButton>
      </FirstPlayerSelectionContainer>
    );
  }
}

const SCREENS = {
  DIFFICULTY_SELECTION: 0,
  FIRST_PLAYER_SELECTION: 1,
  IN_GAME: 2,
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      board: null,
      firstPlayer: PLAYER.HUMAN,
      playerTurn: PLAYER.HUMAN,
      screen: SCREENS.DIFFICULTY_SELECTION,
      selectedDifficulty: DIFFICULTY.BEATABLE,
    };
  }

  getXPlayer() {
    return this.state.firstPlayer;
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

    this.setState({
      board: updatedBoard,
      // Switch whose turn it is.
      playerTurn: playerTurn === PLAYER.HUMAN ? PLAYER.COMPUTER : PLAYER.HUMAN,
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

  onSquareSelected = (selectedRowIndex, selectedColIndex) => {
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

  render() {
    const { board, playerTurn, screen } = this.state;

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
        return (
          <TicTacToeBoard
            board={board}
            playerTurn={playerTurn}
            onSquareSelected={this.onSquareSelected}
          />
        );

      default:
        throw new Error(`Unkown screen: ${screen}`);
    }
  }
}

export default App;
