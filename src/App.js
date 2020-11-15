import React from 'react';
import styled from 'styled-components';

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

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

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      board: [
        [BOARD_MARKER.X, BOARD_MARKER.X, BOARD_MARKER.X],
        [BOARD_MARKER.X, BOARD_MARKER.X, BOARD_MARKER.X],
        [BOARD_MARKER.X, BOARD_MARKER.X, BOARD_MARKER.X],
      ],
    };
  }

  render() {
   const { board } = this.state;

  return (
    <CenteredContainer>
      <TicTacToeBoard board={board} />
    </CenteredContainer>
  );
  }
}

export default App;
