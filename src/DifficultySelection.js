
import React from 'react';
import styled from 'styled-components';

import { DIFFICULTY } from './constants';
import { ConfirmationButton } from './shared';


const DifficultySelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 75vh;
`;

export class DifficultySelection extends React.Component {
  onBeatableClicked = () => {
    this.props.onDifficultySelected(DIFFICULTY.BEATABLE);
  };

  onUnbeatableClicked = () => {
    this.props.onDifficultySelected(DIFFICULTY.UNBEATABLE);
  };

  render() {
    return (
      <DifficultySelectionContainer>
        <h1>Select
          Difficulty</h1>
        <ConfirmationButton
          onClick={this.onBeatableClicked}>
          Beatable
        </ConfirmationButton>
        <ConfirmationButton
          onClick={this.onUnbeatableClicked}>
          Unbeatable
        </ConfirmationButton>
      </DifficultySelectionContainer>
    );
  }
}
