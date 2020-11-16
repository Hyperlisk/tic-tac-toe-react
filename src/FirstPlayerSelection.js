
import React from 'react';
import styled from 'styled-components';

import { PLAYER } from './constants';
import { ConfirmationButton } from './shared';


const FirstPlayerSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 75vh;
`;

export class FirstPlayerSelection extends React.Component {
  onHumanClicked = () => {
    this.props.onFirstPlayerSelected(PLAYER.HUMAN);
  };

  onComputerClicked = () => {
    this.props.onFirstPlayerSelected(PLAYER.COMPUTER);
  };

  render() {
    return (
      <FirstPlayerSelectionContainer>
        <h1>Select
          First
          Player</h1>
        <ConfirmationButton
          onClick={this.onHumanClicked}>
          Human
        </ConfirmationButton>
        <ConfirmationButton
          onClick={this.onComputerClicked}>
          Computer
        </ConfirmationButton>
      </FirstPlayerSelectionContainer>
    );
  }
}
