import React, { useEffect, useRef, useState } from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import styled from 'styled-components';
import Circles from './CirclesHome/Circles';
import Title from './Title';
import MoreInfoSection from './MoreInfo/MoreInfoSection';
import ProfitOverTime from './Animations/ProfitOverTime';
import DataFunctions from '../model/DataFunctions';
import ProfitByTeam from './Animations/ProfitByTeam';

const StyledHome = styled.div`
  background-color: var(--primary-color);
`;
function Home() {
  const circlesRef = useRef(null);
  const [data, setData] = useState([]);
  const [scrollSection, setScrollSection] = useState("TOP");
  const width = window.innerWidth - 100;
  const height = window.outerHeight;
  const settings = isMobile ?
    {
      width: window.innerWidth,
      height: window.outerHeight,
      aSize: [3.0, 3.5],
      xAdjustCircles: [50, 25],
      yAdjustMoreInfo: 500,
      xAdjustMoreInfo1: [25, 200, 50, 10],
      moveByHomeTeam: [15, 200, 25, 25,100],
      iconSize: [25, 35,12],
      moveCirclesWinLoss: [10, 300],
      profitAdjust: [30,30]
    } :
    {
      width: window.innerWidth - 50,
      height: window.outerHeight,
      aSize: [9.5, 10.5],
      xAdjustCircles: [100, 50],
      yAdjustMoreInfo: 500,
      xAdjustMoreInfo1: [25, 200, 25, 25],
      moveByHomeTeam: [35, 200, 25, 25,200],
      iconSize: [50, 75,25], 
      moveCirclesWinLoss: [100, 200],
      profitAdjust: [30,15]
    }
  return (
    <>
      <StyledHome>
        <Circles circlesRef={circlesRef} data={data} setData={setData} scrollSection={scrollSection} setScrollSection={setScrollSection} settings={settings}>
        </Circles>
        <Title />

      </StyledHome>
      <StyledHome >
        <MoreInfoSection data={data} setData={setData} scrollSection={scrollSection} setScrollSection={setScrollSection} settings={settings}/>

      </StyledHome>
      <StyledHome >
        <ProfitOverTime data={DataFunctions.getProfitByDate()} width={width} height={height} />
        <ProfitByTeam data={DataFunctions.getProfitByDate()} width={width} height={height} />
      </StyledHome>
    </>
  );
}

export default Home;