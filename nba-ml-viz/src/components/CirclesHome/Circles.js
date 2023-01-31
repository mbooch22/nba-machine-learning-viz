import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as d3 from 'd3';
import CircleFunctions from '../../model/CircleFunctions';
import GameTooltip from '../CommonHome/GameTooltip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';


const Circles = (props) => {
  const navigate = useNavigate();
  const { circlesRef, data, setData, scrollSection, setScrollSection, settings } = props;
  const previousScrollPosition = useRef(0);
  let width = settings.width;
  let height = settings.height;
  //const circlesRef = useRef(null);
  // const [data, setData] = useState([]);
  const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })

  useEffect(() => {
    // if (document.body.clientWidth !== 0) width = document.body.clientWidth - 100;
    // if (document.body.clientHeight !== 0) height = document.body.clientWidth;
    //width = document.body.clientWidth
    const svg = d3.select(circlesRef.current)
      .attr('width', width)
      .attr('height', height);

    // Generate some circles from data
    const newData = CircleFunctions.generateCircleData(width, height, settings);

    setData(newData);

    // Use the circle elements to draw the circles on the screen
    CircleFunctions.drawCirclesFromData(svg, newData, setTooltipState, navigate);

  }, []);

  useEffect(() => {
    const svg = d3.select(circlesRef.current);

    // Select all the circles and bind them to the new data
    const circles = svg.selectAll('circle').data(data);

      circles
        .transition()
        .duration(3000)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', d => d.color)

  }, [circlesRef, data, width]);

  useEffect(() => {
    const handleScroll = () => {
      const boundingRect = circlesRef.current.getBoundingClientRect();
      const currentScrollPosition = window.pageYOffset;
      if (
        boundingRect.top >= 0 &&
        boundingRect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        currentScrollPosition < previousScrollPosition.current &&
        scrollSection !== "TOP"
      ) {
        //TODO - add check to see if already sorted
        setScrollSection("TOP");
        
        // The bottom of the element is visible, show the alert
        console.log('You have scrolled to the TOP of the section!');
        const svg = d3.select(circlesRef.current);

        CircleFunctions.moveCirclesRandom(svg, data, width, height, settings);
      }
      previousScrollPosition.current = currentScrollPosition;
    }



    // Add an event listener for the scroll event
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [circlesRef, data, height, scrollSection, setScrollSection, width]);

  return (
    <Box display="flex" paddingTop={1} justifyContent="center">

      <svg id="svg1" ref={circlesRef} className="chart">

        {/* The circles will be drawn here */}

      </svg>

      <GameTooltip
        left={tooltipState.left}
        top={tooltipState.top}
        fields={tooltipState.fields}
        data={tooltipState.data} />
    </Box>
  );
};

export default Circles;

