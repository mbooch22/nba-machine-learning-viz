import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
const StyledHero = styled.div`
  * {
     box-sizing: border-box;
    }
  .hero {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
  }

  .hero-body {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    /* padding: 3rem 1.5rem;

    @media screen and (min-width: 980px) {
      padding: 8rem 1.5rem;
    } */
  }
`;

const Hero = ({ children }) => {
    return (
        <StyledHero>
            <div className="hero">
                <div className="hero-body">{children}</div>
            </div>
        </StyledHero>
    );
};

export default Hero;
