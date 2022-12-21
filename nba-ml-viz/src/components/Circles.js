import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Circle from './Circle';
import Buttons from './Button';



const Circles = (props) => {
  const { width, height, numCircles } = props;
  const circlesRef = useRef(null);
  const [data, setData] = useState([]);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const svg = d3.select(circlesRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Generate some circles from data
    const newData = d3.range(numCircles).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 20 + 10
    }));

    setData(newData);

    // Bind the data to the SVG and create one 'circle' element per piece of data
    const circles = svg
      .selectAll('circle')
      .data(newData)
      .join('circle');

    // Use the circle elements to draw the circles on the screen
    circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', 'lightblue');

  }, []);

  useEffect(() => {
    const svg = d3.select(circlesRef.current);

    // Select all the circles and bind them to the new data
    const circles = svg.selectAll('circle').data(data);
    if (sorted) {
    // Use D3's transition function to smoothly animate the circles to their new positions
      // Sort the circles by size and group them in a grid
      circles
        .sort((a, b) => d3.ascending(a.r, b.r))
        .transition()
        .duration(3000)
        .attr('cx', (d, i) => (i % 5) * 100 + 50)
        .attr('cy', (d, i) => Math.floor(i / 5) * 100 + 50);
    } else {
      // Animate the circles back to their original positions
      circles
      .transition()
      .duration(3000)
      .attr('cx', d => d.x + 50)
      .on('end', () => {
        // When the transition ends, update the data with new random positions
        setData(
          data.map(d => ({
            ...d,
            x: Math.random() * width
          }))
        );
      });
    }
  }, [data, sorted, width]);

  const handleSortClick = () => {
    setSorted(true);
  };

  const handleRevertClick = () => {
    setSorted(false);
  };

  return (
    <div>
      <Buttons handleClick={handleSortClick} text={"Sort"} color={"primary"}/>
      <Buttons handleClick={handleRevertClick} text={"Revert"} color={"secondary"}/>
      <svg ref={circlesRef}>
        {/* The circles will be drawn here */}
      </svg>
    </div>
  );
};

export default Circles;

