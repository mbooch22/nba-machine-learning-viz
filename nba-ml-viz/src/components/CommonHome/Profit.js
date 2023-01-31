import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';


const ProfitContainer = styled.div`

`

const Profit = ({ i, profit, width, height, adjust }) => {
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
        <text className='moreinfo-profit' x={width / adjust[0] + xAdjust} y={height/adjust[1]}>
            {profitFormatted}
        </text>

    )
}

export default Profit;