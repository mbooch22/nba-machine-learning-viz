import React from 'react';
import styled from 'styled-components';
import Circles from './Circles';
const StyledHome = styled.div`
  background-color: var(--secondary-color);
`;
function Home() {
    const width = window.innerWidth-100;
    const height = window.innerHeight-100;
    const numCircles = 50;
    return (
        <StyledHome>
        <h1>Welcome to the Home page!</h1>
        <p>This is the main page of your app.</p>
        <Circles width={width} height={height} numCircles={numCircles} />
        </StyledHome>
    );
}

export default Home;