import React from 'react';
import styled from 'styled-components';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../../data/teams.json';
import { Link } from 'react-router-dom';

const GroupContainer = styled.div`

`

const GroupHeader = ({ teamName, games, size }) => {
    const xPos = games[0].x - size[1];
    const yPos = games[0].y - size[2];
    let homeTeamLogo = teamsJson.map((team, i) => {
        if (team.teamName === teamName) {
            const TeamIcon = NBAIcons[team.abbreviation];
            return (
                <Link key={team.abbreviation} to={`team/${team.abbreviation}`}>
                    <TeamIcon size={size[0]} ></TeamIcon>
                </Link>
            )
        } else return (null)
    });

    return (
        <>
            {/* <text x={xPos} y={yPos}>
                {teamName}
            </text> */}
            <svg  x={xPos} y={yPos}>
                {homeTeamLogo}
            </svg>
        </>
    )
}

export default GroupHeader;