import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as d3 from 'd3';
import CircleFunctions from '../../model/CircleFunctions';
import GameTooltip from '../CommonHome/GameTooltip';

const TeamCircles = ({ groupComponents, setGames, teamJson, circlesRef, width, height }) => {
    const navigate = useNavigate();
    const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })
    useEffect(() => {
        const svg = d3.select(circlesRef.current)
            .attr('width', width)
            .attr('height', height);

        // Generate some circles from data
        const teamData = CircleFunctions.generateCircleDataTeam(width, height, teamJson.teamName);    

        setGames(teamData);

        // Use the circle elements to draw the circles on the screen
        CircleFunctions.drawCirclesFromData(svg, teamData, setTooltipState, navigate);

    }, [circlesRef, height, navigate, setGames, teamJson.teamName, width]);


    return (
        <div>
            <svg id={teamJson.simpleName} ref={circlesRef}>
                {groupComponents}
            </svg>

            <GameTooltip
            left={tooltipState.left}
            top={tooltipState.top}
            fields={tooltipState.fields}
            data={tooltipState.data} />
        </div>
    );
};

export default TeamCircles;