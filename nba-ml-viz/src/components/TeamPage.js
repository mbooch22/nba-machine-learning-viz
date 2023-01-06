import React from 'react';
import { useParams } from 'react-router-dom';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../data/teams.json';


const TeamPage = () => {
  const { teamAbr } = useParams();
  const TeamIcon = NBAIcons[teamAbr];

 

  return (
    <>
        <TeamIcon size={300}/>
        {teamAbr}
    </>
  );
};

export default TeamPage;

