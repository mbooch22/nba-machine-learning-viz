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
import BarChartFunctions from '../../model/BarChartFunctions';

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
  const teamGames = DataFunctions
  const circlesRef = useRef(null);
  const barChartRef = useRef(null);
  let width = window.innerWidth - 100;
  let height = window.outerHeight / 3;

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
        CircleFunctions.moveCirclesRandom(svg, games, width, height);
        setGroupComponents([])

        break;
      case 'right':
        const profit = CircleFunctions.moveCirclesWinLossTeamPage(svg, width, height);
        setGroupComponents([profit.map((d, i) => (
          <Profit key={i} i={i} profit={d} width={width} height={height} />
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
      </Box>
    </StyledTeamPage>
  );
};

export default TeamPage;

