
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import App from './App';

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

ReactDOM.render(
  <React.StrictMode>
    <CenteredContainer>
      <App />
    </CenteredContainer>
  </React.StrictMode>,
  document.getElementById('root')
);

