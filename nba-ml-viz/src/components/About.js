import React from 'react';
import styled from 'styled-components';

const StyledAbout  = styled.div`
  background-color: var(--primary-color);
`;
function About() {
  return (
    <StyledAbout >
      <h1>About</h1>
      <p>TODO :)</p>
    </StyledAbout >
  );
}

export default About;