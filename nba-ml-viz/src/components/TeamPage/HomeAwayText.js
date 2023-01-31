import React from 'react';
import styled from 'styled-components';

const TextContainer = styled.div`

`

const HomeAwayText = ({ type, teamName, width, height, groups }) => {
    const xPos = groups[2].x - groups[2].r*2;
    const yPos = groups[2].y - 30;
    let profitFormatted = "";

    switch(type){
        case "Home":
            profitFormatted = `${type}`
            break;
        case "Away":
            profitFormatted = `${type}`
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