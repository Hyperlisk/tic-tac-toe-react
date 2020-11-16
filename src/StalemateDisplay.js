import React from 'react';

import { ConfirmationButton, DisplayBanner, DisplayBannerContainer } from './shared';

import { TicTacToeBoard } from './TicTacToeBoard';


export function StalemateDisplay(props) {
  const { board, playerTurn, onPlayAgainClicked } = props;
  return (
    <DisplayBannerContainer>
      <TicTacToeBoard board={board} playerTurn={playerTurn}/>
      <DisplayBanner>
        <div>Stalemate!</div>
        <ConfirmationButton onClick={onPlayAgainClicked}>
          Play Again
        </ConfirmationButton>
      </DisplayBanner>
    </DisplayBannerContainer>
  );
}
