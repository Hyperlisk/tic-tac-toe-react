import React from 'react';
import styled from 'styled-components';

import { PLAYER } from './constants';


const TicTacToeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90vh;
  height: 90vh;
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
  font-size: 24vh;
  font-family: arial;
`;

export class TicTacToeBoard extends React.Component {
  onSquareClicked = e => {
    const { playerTurn, onSquareClicked } = this.props;

    if (!onSquareClicked) {
      // No handler, so nothing to handle.
      return;
    }

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

    onSquareClicked(rowIndex, columnIndex);
  };

  render() {
    const { board, playerTurn } = this.props;

    return (
      <TicTacToeBoardContainer>
        {board.map((row, rowIndex) => (
          <TicTacToeBoardRow
            key={rowIndex}>
            {row.map((square, squareIndex) => (
              <TicTacToeBoardSquare
                key={squareIndex}
                playerTurn={playerTurn}
                onClick={this.onSquareClicked}
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