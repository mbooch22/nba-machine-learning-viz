import React from 'react';
import { useParams } from 'react-router-dom';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../data/teams.json';
import gamesJson from '../data/games.json';

const GamePage = () => {
    const { gameID } = useParams();
    let homeTeamAbr = "TOR";
    let awayTeamAbr = "TOR";
    const game = gamesJson.find(game => (game.Date + game.Name).toString().replaceAll(" ", "") === gameID)
    homeTeamAbr = teamsJson.find(d => d.teamName === game["Home Team"]).abbreviation;
    awayTeamAbr = teamsJson.find(d => d.teamName === game["Away Team"]).abbreviation;
    let awayTeamLogo = teamsJson.map((team, i) => {
        if (team.abbreviation.includes(awayTeamAbr)) {
            const TeamIcon = NBAIcons[team.abbreviation];
            return (
                <TeamIcon size={300} key={team.abbreviation}></TeamIcon>
            )
        } else return (null)
    });
    let homeTeamLogo = teamsJson.map((team, i) => {
        if (team.abbreviation.includes(homeTeamAbr)) {
            const TeamIcon = NBAIcons[team.abbreviation];
            return (
                <TeamIcon size={300} key={team.abbreviation}></TeamIcon>
            )
        } else return (null)
    });




    return (
        <>
            <div>
                {awayTeamLogo}
                @
                {homeTeamLogo}
            </div>
            {gameID}
            <div>
                <span>
                    Individual Game - TODO :)
                </span>
            </div>
        </>
    );
};

export default GamePage;

