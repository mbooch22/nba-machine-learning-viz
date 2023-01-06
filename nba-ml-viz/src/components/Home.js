import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Circles from './CirclesHome/Circles';
import TeamsSection from './TeamsSections';
import Title from './Title';
import MoreInfoSection from './MoreInfo/MoreInfoSection';

const StyledHome = styled.div`
  background-color: var(--primary-color);
`;
function Home() {
  const circlesRef = useRef(null);
  const [data, setData] = useState([]);
  const [scrollSection, setScrollSection] = useState("TOP");
  const width = window.innerWidth - 100;
  const height = window.outerHeight ;
  const numCircles = 50;
  const items = [1, 2, 3, 4]
  return (
    <>
      <StyledHome>
        <TeamsSection>
        </TeamsSection>
        <Circles circlesRef={circlesRef} data={data} setData={setData} scrollSection={scrollSection} setScrollSection={setScrollSection}>
        </Circles>
        <Title />

      </StyledHome>
      <StyledHome >
        <MoreInfoSection data={data} setData={setData} scrollSection={scrollSection} setScrollSection={setScrollSection}/>

      </StyledHome>
    </>
  );
}

export default Home;