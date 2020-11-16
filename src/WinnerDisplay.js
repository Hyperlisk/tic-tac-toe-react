import React from 'react';

import { ConfirmationButton, DisplayBanner, DisplayBannerContainer } from './shared';

import { TicTacToeBoard } from './TicTacToeBoard';


export function WinnerDisplay(props) {
  const { board, winner, onPlayAgainClicked } = props;
  return (
    <DisplayBannerContainer>
      <TicTacToeBoard board={board} playerTurn={winner}/>
      <DisplayBanner>
        <div>{winner} wins!</div>
        <ConfirmationButton onClick={onPlayAgainClicked}>
          Play Again
        </ConfirmationButton>
      </DisplayBanner>
    </DisplayBannerContainer>
  );
}