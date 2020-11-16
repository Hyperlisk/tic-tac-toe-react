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

const TicTacToeBoardSquare = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23vh;
  height: 23vh;
  border: 1px solid #000;
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
  render() {
    const { board } = this.props;

    return (
      <TicTacToeBoardContainer>
        {board.map((row, rowIndex) => (
          <TicTacToeBoardRow key={rowIndex}>
            {row.map((square, squareIndex) => (
              <TicTacToeBoardSquare key={squareIndex}>{square}</TicTacToeBoardSquare>
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
      playerTurn: PLAYER.HUMAN,
      screen: SCREENS.DIFFICULTY_SELECTION,
      selectedDifficulty: DIFFICULTY.BEATABLE,
    };
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
      // Set the current player's turn to be the one selected.
      playerTurn: firstPlayer,
      // Move us to the actual game.
      screen: SCREENS.IN_GAME,
    });
  };

  render() {
    const { board, screen } = this.state;

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
          <TicTacToeBoard board={board} />
        );

      default:
        throw new Error(`Unkown screen: ${screen}`);
    }
  }
}

export default App;
