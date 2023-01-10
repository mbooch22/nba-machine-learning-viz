import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../../data/teams.json';
import * as d3 from 'd3';

const TextContainer = styled.div`

`

const HomeAwayText = ({ type, teamName, width, height, groups }) => {
    const xPos = groups[2].x - groups[2].r*2;
    const yPos = groups[2].y - 30;
    let profitFormatted = "";
    let xAdjust = 0;
    let yAdjust = 0;
    switch(type){
        case "Home":
            profitFormatted = `${type}`
            xAdjust = 2
            yAdjust = height/25
            break;
        case "Away":
            profitFormatted = `${type}`
            xAdjust = 4
            yAdjust = height/25
            break;
        default:
            break;
    }
    return (
        <text x={xPos} y={yPos}>
            {profitFormatted}
        </text>

    )
}

export default HomeAwayText;