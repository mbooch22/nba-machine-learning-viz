import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as NBAIcons from 'react-nba-logos';
import teamsJson from '../../data/teams.json';
import * as d3 from 'd3';

const ProfitContainer = styled.div`

`

const Profit = ({ i, profit, width, height }) => {
    let profitFormatted = "";
    let xAdjust = 0;
    switch(i){
        case 0:
            profitFormatted = `💲${profit}`
            xAdjust = -75
            break;
        case 1:
            profitFormatted = `➖💲${Math.abs(profit)}`
            xAdjust = 0
            break;
        case 2:
            profitFormatted = `󠀽󠀽= 💲${profit}`
            xAdjust = 100
            break;
        default:
            break;
    }
    return (
        <text className='moreinfo-profit' x={width / 2 + xAdjust} y={height/8}>
            {profitFormatted}
        </text>

    )
}

export default Profit;