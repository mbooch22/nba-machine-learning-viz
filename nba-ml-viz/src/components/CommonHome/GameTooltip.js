import React from "react";
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../../data/teams.json';

const GameTooltip = (props) => {
    const { left, top, fields, data } = props;
    let homeTeamAbr = "TOR";
    let awayTeamAbr = "TOR";
    if (data.Date) {
        homeTeamAbr = teamsJson.find(d => d.teamName === data["Home Team"]).abbreviation;
        awayTeamAbr = teamsJson.find(d => d.teamName === data["Away Team"]).abbreviation;
    }
    let awayTeamLogo = teamsJson.map((team, i) => {
        if (team.abbreviation.includes(awayTeamAbr)) {
            const TeamIcon = NBAIcons[team.abbreviation];
            return (
                <TeamIcon key={team.abbreviation}></TeamIcon>
            )
        } else return (null)
    });
    let homeTeamLogo = teamsJson.map((team, i) => {
        if (team.abbreviation.includes(homeTeamAbr) ) {
            const TeamIcon = NBAIcons[team.abbreviation];
            return (
                <TeamIcon key={team.abbreviation}></TeamIcon>
            )
        } else return (null)
    });
    return (
        <div>
            <div
                className="tooltip3"
                style={{
                    display: fields.length ? "block" : "none",
                    top: `${top}`,
                    left: `${left}`,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    border: '1px solid gray',
                    boxShadow: '0 0 5px gray',
                    textAlign: 'center',
                }}>
                <div>
                    {awayTeamLogo}
                    {homeTeamLogo}
                </div>
                {data ? (
                    <div>
                        <span>{data["Date"]}</span>
                        <br />
                        <span>{data["Name"]}</span>
                        <br />
                        <span>Record: {data.winsOnly} - {data.lossesOnly}</span>
                        <br />
                        <span>Profit: ${data.totalProfit > 0 ? (
                            <span className="profit">{data.totalProfit}</span>
                        ) : (
                            <span className="profitLoss">{data.totalProfit}</span>
                        )
                        }
                        </span>
                        <br />
                        {data["BET SPREAD"] ? (
                            <span>Spread Bet: {data["BET SPREAD"]}</span>
                        ) : (null)}
                        <br />
                        {data["BET TOTAL"] ? (
                            <span>Over/Under Bet: {data["BET TOTAL"]}</span>
                        ) : (null)}
                        <br />
                        {data["BET HOME"] ? (
                            <span>Home O/U Bet: {data["BET HOME"]}</span>
                        ) : (null)}
                        <br />
                        {data["BET AWAY"] ? (
                            <span>Away O/U Bet: {data["BET AWAY"]}</span>
                        ) : (null)}
                        <br />
                        {data["BET WIN"] ? (
                            <span>ML Odds/Bet: {data["ML_BET_ON"]}/{data["BET WIN"]}</span>
                        ) : (null)}
                        <br />
                    </div>
                ) :
                    null}
            </div>
        </div>

    )

}

export default GameTooltip;