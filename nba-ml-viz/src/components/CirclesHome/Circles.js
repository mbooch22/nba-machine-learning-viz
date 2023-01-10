import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as d3 from 'd3';
import Buttons from '../CommonHome/Button';
import CircleFunctions from '../../model/CircleFunctions';
import GameTooltip from '../CommonHome/GameTooltip';



const Circles = (props) => {
  const navigate = useNavigate();
  const { circlesRef, data, setData, scrollSection, setScrollSection } = props;
  const previousScrollPosition = useRef(0);
  let width = window.innerWidth;
  let height = window.outerHeight;
  //const circlesRef = useRef(null);
  // const [data, setData] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })

  useEffect(() => {
    // if (document.body.clientWidth !== 0) width = document.body.clientWidth - 100;
    // if (document.body.clientHeight !== 0) height = document.body.clientWidth;
    //width = document.body.clientWidth
    const svg = d3.select(circlesRef.current)
      .attr('width', width)
      .attr('height', height);

    // Generate some circles from data
    const newData = CircleFunctions.generateCircleData(width, height);

    setData(newData);

    // Use the circle elements to draw the circles on the screen
    CircleFunctions.drawCirclesFromData(svg, newData, setTooltipState, navigate);

  }, []);

  useEffect(() => {
    const svg = d3.select(circlesRef.current);

    // Select all the circles and bind them to the new data
    const circles = svg.selectAll('circle').data(data);
    if (sorted) {
      // Use D3's transition function to smoothly animate the circles to their new positions
      // Sort the circles by size and group them in a grid
      circles
        .sort((a, b) => d3.ascending(a.totalProfit, b.totalProfit))
        .transition()
        .duration(3000)
        .attr('fill', d => d.color)
        .attr('cx', (d, i) => (i % 25) * 30 + 200)
        .attr('cy', (d, i) => Math.floor(i / 25) * 30 + 50);
    } else {
      circles
        .transition()
        .duration(3000)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', d => d.color)
      // Animate the circles back to their original positions
      // circles
      // .transition()
      // .duration(3000)
      // .attr('cx', d => d.x + 50)
      // .on('end', () => {
      //   // When the transition ends, update the data with new random positions
      //   setData(
      //     data.map(d => ({
      //       ...d,
      //       x: Math.random() * width
      //     }))
      //   );
      // });
    }
  }, [circlesRef, data, sorted, width]);

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

        CircleFunctions.moveCirclesRandom(svg, data, width, height);
      }
      previousScrollPosition.current = currentScrollPosition;
    }



    // Add an event listener for the scroll event
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [circlesRef, data, height, scrollSection, setScrollSection, width]);

  const handleSortClick = () => {
    setSorted(true);
  };

  const handleRevertClick = () => {
    setSorted(false);
  };

  return (
    <div>
      <svg id="svg1" ref={circlesRef} className="chart">

        {/* The circles will be drawn here */}

      </svg>
      {/* <Title title={"An Interactive Visualization of a Machine Learning Model's Predictions of NBA Games"} className='title' /> */}
      <Buttons handleClick={handleSortClick} text={"Sort"} color={"primary"} />
      <Buttons handleClick={handleRevertClick} text={"Revert"} color={"secondary"} />
      <GameTooltip
        left={tooltipState.left}
        top={tooltipState.top}
        fields={tooltipState.fields}
        data={tooltipState.data} />
    </div>
  );
};

export default Circles;

