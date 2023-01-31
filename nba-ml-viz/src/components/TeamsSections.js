import React from "react";

import teamsJson from '../data/teams.json';
import * as NBAIcons from 'react-nba-logos';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const TeamsSection = (props) => {
    const teamsIcons = teamsJson.map((team, i) => {
        const TeamIcon = NBAIcons[team.abbreviation];
        return (
            <Button className="nbaIcon" key={team.abbreviation}>
                <Link  to={`team/${team.abbreviation}`}>
                <TeamIcon></TeamIcon>
                </Link>
            </Button>
        )
    });
    return (
        <div width={window.innerWidth} height={window.innerHeight}>
            <section id="teamsSections" className="pb-5">
                <div className="col-md-12 mx-auto">
                    {teamsIcons}
                </div>
            </section>
        </div>
    )
}
export default TeamsSection;