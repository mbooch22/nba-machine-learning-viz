import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../../data/teams.json';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import TeamToggleButton from './TeamToggleButton';
import * as d3 from 'd3';
import DataFunctions from '../../model/DataFunctions';
import TeamCircles from './TeamCircles';
import CircleFunctions from '../../model/CircleFunctions';
import Profit from '../CommonHome/Profit';
import HomeAwayText from './HomeAwayText';
import TeamBarChart from './TeamBarChat';
import ProfitOverTime from '../Animations/ProfitOverTime';
import { isMobile } from 'react-device-detect';
const StyledTeamPage = styled.div`
    .title-logo {
      span {
        color: black;
      }
    }
`;



const TeamPage = () => {
  const { teamAbr } = useParams();
  const [games, setGames] = useState([]);
  const [groupComponents, setGroupComponents] = useState([]);
  const [alignment, setAlignment] = useState('center');
  const TeamIcon = NBAIcons[teamAbr];
  const teamJson = teamsJson.find(team => team.abbreviation === teamAbr);
  const circlesRef = useRef(null);
  const barChartRef = useRef(null);
  let width = window.innerWidth - 100;
  let height = window.outerHeight / 3;


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
    moveCirclesWinLoss: [10, 50],
    profitAdjust: [30,5]
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
    moveCirclesWinLoss: [50, 100],
    profitAdjust: [30,5]
  }

  useEffect(() => {
    handleAlignment("", "center")
    setGroupComponents([])
}, []);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    const svg = d3.select(circlesRef.current);
    
    switch (newAlignment) {
      case 'left':
        //Move Circles
        const groups = CircleFunctions.moveCirclesHomeAway(svg, width, height, teamJson.teamName);
        setGroupComponents(Array.from(groups).map(group => (
          <HomeAwayText key={group[0]} type={group[0]} groups={group[1]} width={width} height={height} teamName={teamJson.teamName}  />
      )))
        break;
      case 'center':
        CircleFunctions.moveCirclesRandom(svg, games, width, height, settings);
        setGroupComponents([])
        break;
      case 'right':
        const { profits, winLossGroups } = CircleFunctions.moveCirclesWinLoss(svg, width, height, settings);
        setGroupComponents([profits.map((d, i) => (
            <Profit key={i} i={i} profit={d} groups={winLossGroups.get("win")} width={width} height={height} adjust={settings.profitAdjust} />
        ))])
        break;
      default:
        break;
    }
  };

  return (
    <StyledTeamPage>
      <div className='title-logo'>
        <Box display="flex" justifyContent="center">
          <TeamIcon size={300} />
        </Box>
        <Box display="flex" justifyContent="center">
          <span>{teamJson.teamName}</span>
        </Box>
      </div>
      <div>
        <Box display="flex" paddingTop={10} justifyContent="center">
          <TeamToggleButton alignment={alignment} handleAlignment={handleAlignment} />
        </Box>
      </div>
      <Box display="flex" paddingTop={10} justifyContent="center">
        <TeamCircles groupComponents={groupComponents} setGames={setGames} width={width} height={height} teamJson={teamJson} circlesRef={circlesRef} />
      </Box>
      <Box display="flex" paddingTop={10} justifyContent="center">
        <TeamBarChart teamName={teamJson.teamName} width={width} height={height} barChartRef={barChartRef} alignment={alignment}/>
      </Box>
      <Box display="flex" paddingTop={10} justifyContent="center">
        <ProfitOverTime data={DataFunctions.getProfitByDatePerTeam(teamJson.teamName)} width={width} height={height}/>
      </Box>
    </StyledTeamPage>
  );
};

export default TeamPage;

