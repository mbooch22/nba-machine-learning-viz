import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import DataFunctions from '../../model/DataFunctions';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import CurrencyFormat from 'react-currency-format';
import DayTooltip from '../CommonHome/DayTooltip';
import { useNavigate } from "react-router-dom";
import ex_data from '../../data/example_data.json'
import teamsJson from '../../data/teams.json'

const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
// const margin = ({ top: 16, right: 6, bottom: 6, left: 0 })
const delay = 500;

const duration = 250;


const ProfitByTeam = ({ data, width, height }) => {
    const new_data = DataFunctions.getTeamProfitByDates()
    const test_data = ex_data;
    const chartRef = useRef(null);
    const [sliderValue, setSliderValue] = useState(0);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const [play, setPlay] = useState(false)

    //chart functions
    
    const xAxisScale = d3.scaleLinear().range([0, innerWidth - margin.right]);
    const yAxisScale = d3
        .scaleBand()
        .range([0, innerHeight - margin.top])
        .padding(0.4);

    const drawRects = (svg, sliderValue) => {
        const xAxisContainer = svg.select(`.x-axis`);
        const yAxisContainer = svg.select(`.y-axis`);
        const t = svg.transition()
            .ease(d3.easeLinear)
            .duration(delay);
        const curr_day_data = new_data[sliderValue].sort(({ totalProfit: firstValue }, { totalProfit: secondValue }) =>
            secondValue - firstValue
        );
        xAxisScale.domain([0, d3.max(curr_day_data, d => Math.abs(d.totalProfit)) + margin.right])
        yAxisScale.domain(curr_day_data.map(({ team }) => team));

        xAxisContainer.transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .call(
                d3
                    .axisTop(xAxisScale)
                    .ticks(5)
                    .tickSize(-innerHeight)
            );

        yAxisContainer
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .call(d3.axisLeft(yAxisScale).tickSize(0));

        // Data Binding
        const barGroups = svg
            .select(".columns")
            .selectAll("g.column-container")
            .data(curr_day_data, ({ team }) => team);

        // Enter selection
        const barGroupsEnter = barGroups
            .enter()
            .append("g")
            .attr("class", "column-container")
            .attr("transform", `translate(0,${innerHeight - margin.top})`);

        barGroupsEnter
            .append("rect")
            .attr("class", "column-rect")
            .attr("width", 0)
            .attr("height", yAxisScale.step() * (1 - 0.4));

        barGroupsEnter
            .append("text")
            .attr("class", "column-title")
            .attr("y", (yAxisScale.step() * (1 - 0.4)) / 2)
            .attr("x", -5)
            .text(({ team }) => team);

        barGroupsEnter
            .append("text")
            .attr("class", "column-value")
            .attr("y", (yAxisScale.step() * (1 - 0.4)) / 2)
            .attr("x", 5)
            .text(0);

        // Update selection
        const barUpdate = barGroupsEnter.merge(barGroups);

        barUpdate
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("transform", ({ team }) => `translate(0,${yAxisScale(team)})`)
            .attr("fill", d => teamsJson.find(t => t.abbreviation === d.team).colorHome);

        barUpdate
            .select(".column-rect")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("width", ({ totalProfit }) => xAxisScale(Math.abs(totalProfit)));

        barUpdate
            .select(".column-title")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", ({ totalProfit }) => xAxisScale(Math.abs(totalProfit)));

        barUpdate
            .select(".column-value")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", ({ totalProfit }) => xAxisScale(Math.abs(totalProfit)) + margin.right)
            .tween("text", function ({ totalProfit }) {
                const interpolateStartValue =
                    2000 === 3500
                        ? this.currentValue || 0
                        : +this.innerHTML;

                const interpolate = d3.interpolate(interpolateStartValue, totalProfit);
                this.currentValue = totalProfit;

                return function (t) {
                    d3.select(this).text(Math.ceil(interpolate(t)));
                };
            });
        // Exit selection
        const bodyExit = barGroups.exit();

        bodyExit
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
            .attr("transform", `translate(0,${innerHeight})`)
            .on("end", function () {
                d3.select(this).attr("fill", "none");
            });

        bodyExit
            .select(".column-title")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", 0);

        bodyExit
            .select(".column-rect")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("width", 0);

        bodyExit
            .select(".column-value")
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", 5)
            .tween("text", function () {
                const interpolate = d3.interpolate(this.currentValue, 0);
                this.currentValue = 0;

                return function (t) {
                    d3.select(this).text(Math.ceil(interpolate(t)));
                };
            });
        // curr_day_data.forEach((d, i) => {
        //     const group = svg.append("g");
        //     let id = `rect_${d.team}`.toString();
        //     const rect_exist = svg.selectAll('#' + id)
        //     let rect = group.selectAll("rect");
        //     if (rect_exist.node() === null) {
        //         //draw rect
        //         rect
        //             .data(d, d => `${d.date}:${d.team}`)
        //             .join(
        //                 enter => enter.append("rect")
        //                     .style("mix-blend-mode", "darken")
        //                     .attr("fill", d => d.totalProfit < 0 ? 'red' : 'green')
        //                     .attr("height", 100)
        //                     .attr("x", innerWidth / 2)
        //                     .attr("y", d => innerHeight / 2)
        //                     .attr("width", y.bandwidth() + 1)
        //                     .attr("id", d => `rect_${d.i}`),
        //                 update => update,
        //                 exit => exit.call(rect => rect.transition(t).remove()
        //                     .attr("y", innerHeight / 2)
        //                     .attr("height", 100))
        //             );

        //         rect.transition(t)
        //             .attr("x", d => x1(Math.max(0, d.totalProfit)))
        //             .attr("height", d => 100);
        //     }
        //     else {
        //         //update rect
        //     }
        // })

    }




    const handleSliderChange = (event, newValue) => {
        setPlay(false);
        setSliderValue(newValue);
    };
    const handlePlayChange = (event) => {
        if (sliderValue === data.length - 1) {
            setSliderValue(0);
        }
        setPlay(!play)

    };



    //initialize svg effect
    useEffect(() => {
        const svg = d3.select(chartRef.current)
            .attr('width', innerWidth)
            .attr('height', innerHeight);
        // const svg = d3.create("svg")
        // .attr("viewBox", [0, 0, width, height]);

        // svg.append("g")
        //     .call(xAxis)


        // svg.append("g")
        //     .call(yAxis);


    }, []);

    //update chart effect
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        // const svg = d3.create("svg")
        // .attr("viewBox", [0, 0, width, height]);



        const group = svg.append("g");

        let rect = group.selectAll("rect");
        drawRects(svg, sliderValue);



        // const updateBars = bars(svg);
        // const updateAxis = axis(svg);
        // const updateLabels = labels(svg);
        // const updateTicker = ticker(svg);

        // //svg.node();
        // for (const keyframe of keyframes) {
        //     const transition = svg.transition()
        //         .duration(duration)
        //         .ease(d3.easeLinear);

        //     // Extract the top bar’s value.
        //     x.domain([0, keyframe[1][0].value]);

        //     updateAxis(keyframe, transition);
        //     updateBars(keyframe, transition);
        //     updateLabels(keyframe, transition);
        //     updateTicker(keyframe, transition);

        //     //svg.interrupt()
        //     //transition.end();
        //   }
        // chartUpdate(sliderValue, svg, rect, group)
        //chart.update(year)

    }, [sliderValue]);


    //Update slider effect
    useEffect(() => {
        if (play) {
            setTimeout(
                () => {
                    if (sliderValue + 1 <= data.length - 1) {
                        setSliderValue(sliderValue + 1)
                    }
                    else {
                        setPlay(false);
                    }
                },
                delay
            );
        }


        //return () => {};
    }, [play, sliderValue]);

    //auto play when section is scrolled to effect
    useEffect(() => {
        const handleScroll = () => {
            const boundingRect = chartRef.current.getBoundingClientRect();

            if (boundingRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                // setPlay(true);
            }
        }

        // Add an event listener for the scroll event
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);




    return (
        <Box paddingLeft={10} paddingRight={10}>
            <Box display="flex" paddingTop={10} justifyContent="center">
                <Typography id="non-linear-slider" variant="h4" gutterBottom>
                    Profit By Team
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
                <Typography id="non-linear-slider" variant="h4" gutterBottom>
                </Typography>
            </Box>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Button onClick={handlePlayChange}>
                        {play ? (
                            <PauseIcon />
                        ) : (<PlayArrowIcon />)}

                    </Button>
                </Grid>
                <Grid item xs>
                    <Slider
                        //defaultValue={data[0].i}
                        aria-labelledby="input-slider"
                        valueLabelDisplay="off"
                        //step={1}
                        onChange={handleSliderChange}
                        // marks={true}
                        min={0}
                        max={data.length - 1}
                        value={typeof sliderValue === 'number' ? sliderValue : 0}

                    />
                </Grid>

                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        <span>{data[sliderValue].date}</span>
                    </Typography>
                </Grid>
            </Grid>

            <svg ref={chartRef} >
                <g className="x-axis"></g>
                <g className="y-axis"></g>
                <g className="columns"></g>
            </svg>

        </Box>
    )
}

export default ProfitByTeam;