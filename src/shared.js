
import styled from 'styled-components';


export const DisplayBannerContainer = styled.div`
  position: relative;
`;

export const DisplayBanner = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: rgba(255, 2555, 255, 0.9);
  font-size: 20vh;
  text-align: center;
  position: absolute;
  height: 50vh;
  top: calc(50% - 25vh);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ConfirmationButton = styled.button`
  border: 1px outset #33C;
  border-radius: 10px;
  background-color: #55E;
  color: #EEE;
  font-size: 8vh;
  width: 50vh;
  height: 20vh;
`;
