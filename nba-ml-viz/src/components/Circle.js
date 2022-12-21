import React from 'react';
import * as d3 from 'd3';

const Circle = (props) => {
  const { x, y, radius } = props;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill="red"
    />
  );
};

export default Circle;


// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// function CircleAnimation() {
//   const svgRef = useRef();
//   const width = window.innerWidth-50;
//   const height = window.innerHeight-50;

//   useEffect(() => {
//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height);

//     // create random circles
//     const circles = d3.range(50).map(() => {
//         return {
//         x: Math.random() * width,
//         y: Math.random() * height,
//         r: Math.random() * 20 + 10
//         };
//     });

//     // draw circles
//     const circle = svg.selectAll("circle")
//         .data(circles)
//         .enter().append("circle")
//         .attr("cx", d => d.x)
//         .attr("cy", d => d.y)
//         .attr("r", d => d.r)
//         .attr("class", "circle")
//         .attr('fill', 'teal');

//     function moveCircle() {
//       // move circles
//       circle
//         .transition()
//         .duration(3000)
//         .attr('cx', width - 50)
//         .on('end', () => {
//           circle
//             .transition()
//             .duration(3000)
//             .attr('cx', 50)
//             .on('end', moveCircle);
//         });
//     }

//     moveCircle();
//   }, []);

//   return <svg ref={svgRef} />;
// }

// export default CircleAnimation;