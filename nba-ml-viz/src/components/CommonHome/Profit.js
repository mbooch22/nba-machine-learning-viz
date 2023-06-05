import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';


const ProfitContainer = styled.div`

`

const Profit = ({ i, profit, width, height, adjust, groups }) => {
    let profitFormatted = "";
    let xAdjust = 0;
    const xPos = groups[adjust[1]].x;
    const yPos = groups[0].y - adjust[0];
    switch(i){
        case 0:
            profitFormatted = `💲${profit}`
            xAdjust = 0
            break;
        case 1:
            profitFormatted = `➖💲${Math.abs(profit)}`
            xAdjust = 75
            break;
        case 2:
            profitFormatted = `󠀽󠀽= 💲${profit}`
            xAdjust = 175
            break;
        default:
            break;
    }
    return (
        <text className='moreinfo-profit' x={xPos + xAdjust} y={yPos}>
            {profitFormatted}
        </text>

    )
}

export default Profit;