import React from 'react';
import styled from 'styled-components';

const StyledAbout  = styled.div`
  /* Add styles for the Home component here */
`;
function About() {
  return (
    <StyledAbout >
      <h1>About</h1>
      <p>This is the about page of your app.</p>
    </StyledAbout >
  );
}

export default About;