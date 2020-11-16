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

const DifficultyButton = styled.button`
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

class DifficultySelection extends React.Component {
  render() {
    return (
      <DifficultySelectionContainer>
        <h1>Select Difficulty</h1>
        <DifficultyButton>
          Beatable
        </DifficultyButton>
        <DifficultyButton>
          Unbeatable
        </DifficultyButton>
      </DifficultySelectionContainer>
    );
  }
}

const SCREENS = {
  DIFFICULTY_SELECTION: 0,
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      screen: SCREENS.DIFFICULTY_SELECTION,
    };
  }

  render() {
    const { screen } = this.state;

    switch (screen) {
      case SCREENS.DIFFICULTY_SELECTION:
        return (
          <DifficultySelection />
        );

      default:
        throw new Error(`Unkown screen: ${screen}`);
    }
  }
}

export default App;
