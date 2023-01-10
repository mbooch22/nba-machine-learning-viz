import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from "react-router-dom";
import BarChartFunctions from '../../model/BarChartFunctions';
import GameTooltip from '../CommonHome/GameTooltip';

const TeamBarChart = ({ teamName, barChartRef, width, height, alignment }) => {
    const navigate = useNavigate();
    const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })
    let data = BarChartFunctions.generateBarData(teamName, width, height)
    useEffect(() => {
        
        const svg = d3.select(barChartRef.current)
            .attr('width', width)
            .attr('height', height);

        BarChartFunctions.drawRectsFromData(svg, data, width, height, setTooltipState, navigate);


    }, [barChartRef, height, navigate, teamName, width]);

    useEffect(() => {
        const barRef = d3.select(barChartRef.current);
        switch (alignment) {
            case 'left':
              //Move Rects
              const rectGroups = BarChartFunctions.moveRectsHomeAway(barRef, width, height, teamName, data, setTooltipState, navigate);
      
              break;
            case 'center':
                //Clear Current Chart
                barRef.selectAll("*").remove();
                BarChartFunctions.drawRectsFromData(barRef, data, width, height, setTooltipState, navigate);
              break;
            case 'right':
                //Clear Current Chart
                barRef.selectAll("*").remove();
                BarChartFunctions.moveRectsWinLoss(barRef, width, height, teamName, data, setTooltipState, navigate);
              break;
            default:
              break;
          }
    }, [alignment])

    return (
        <>
            <svg ref={barChartRef} />
            <GameTooltip
                left={tooltipState.left}
                top={tooltipState.top}
                fields={tooltipState.fields}
                data={tooltipState.data} />
        </>

    );
};

export default TeamBarChart;
