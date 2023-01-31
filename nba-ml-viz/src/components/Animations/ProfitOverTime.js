import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import CurrencyFormat from 'react-currency-format';
import DayTooltip from '../CommonHome/DayTooltip';
import { useNavigate } from "react-router-dom";


const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
//const dates = DataFunctions.getProfitByDate();
//{date: 'Tue Feb 09 2021', i: 0, totalProfit: -127}

const delay = 250;

const ProfitOverTime = ({ data, width, height }) => {
    //initialization
    const lineRef = useRef(null);
    const [sliderValue, setSliderValue] = useState(0);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const [play, setPlay] = useState(false)
    const [totalProfitByDay, setTotalProfitByDay] = useState(0)
    const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })
    const navigate = useNavigate();

    //chart functions
    const valuetext = (value) => {
        return `${data[value].date}`;
    }
    const yValue = d => d.totalProfit;
    const y = d3.scaleLinear()
        .domain(d3.extent(data, yValue)).nice()
        .range([innerHeight - margin.bottom, 0]);
    const x = d3.scaleBand()
        .domain(Array.from(d3.group(data, d => d.i).keys()).sort(d3.descending))
        .range([innerWidth - margin.right, margin.left])

    const yAxis = g => g
        .attr("transform", `translate(${innerWidth - margin.right},0)`)
        .call(d3.axisRight(y).ticks(null))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.y))

    const xAxis = g => g
        .attr("transform", `translate(0,${innerHeight - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.ticks(...d3.extent(data, d => d.i), innerWidth / 80))
            .tickSizeOuter(6))
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.x))
    const yearStep = 1
    const yearMin = d3.min(data, d => d.i)

    const drawRect = (rect, t, group, dx, i) => {

        rect = rect
            .data(data.filter(d => d.i === i), d => `${d.date}:${d.i}`)
            .join(
                enter => enter.append("rect")
                    .style("mix-blend-mode", "darken")
                    .attr("fill", d => d.totalProfit < 0 ? 'red' : 'green')
                    .attr("x", d => x(d.i) /*+ dx*/)
                    .attr("y", d => y(0))
                    .attr("width", x.bandwidth() + 1)
                    .attr("id", d => `rect_${d.i}`)
                    .attr("height", 0),
                update => update,
                exit => exit.call(rect => rect.transition(t).remove()
                    .attr("y", y(0))
                    .attr("height", 0))
            );

        rect.transition(t)
            .attr("y", d => y(Math.max(0, yValue(d))))
            .attr("height", d => Math.abs(y(0) - y(d.totalProfit)));

        rect.on("mouseover", d => {
            setTooltipState({
                top: (d.pageY - 10) + "px",
                left: (d.pageX + 10) + "px",
                fields: [
                    `Title: ${d.currentTarget.__data__.date}`,
                ],
                data: d.currentTarget.__data__
            });
        })
        .on("mouseout", () => {
            setTooltipState({
                fields: [],
                data: {}
            });
        })
        .on("click", d => {
            navigate(`/date/${d.currentTarget.__data__.date}`)
        });

        // group.transition(t)
        //     .attr("transform", `translate(${-dx},0)`);
    }

    const chartUpdate = (i, svg, rect, group) => {
        const dx = x.step() * (i - yearMin) / yearStep;
        let pass = false;
        const t = svg.transition()
            .ease(d3.easeLinear)
            .duration(delay);

        data.forEach((d, index) => {
            let id = `rect_${d.i}`.toString();
            if (index > i) {
                const removeRect = svg.selectAll('#' + id)
                removeRect.transition(t)
                    .attr("y", d => y(0))
                    .attr("height", d => 0)
                    .remove();
            } else if (index < i) {
                const addRect = svg.selectAll('#' + id)
                if (addRect.node() === null) {
                    let newGroup = svg.append("g");
                    let newRect = newGroup.selectAll("rect");
                    drawRect(newRect, t, newGroup, dx, index);
                }
            } else if (index === i) {
                pass = svg.selectAll('#' + id).node() === null;
            }
        })
        if (pass) {
            drawRect(rect, t, group, dx, i);
        }

    }

    const calcProfitFromCurrentDate = (i) => {
        return _.sumBy(data.filter(d => d.i <= i), 'totalProfit')
    }

    //initialize svg effect
    useEffect(() => {
        const svg = d3.select(lineRef.current)
            .attr('width', innerWidth)
            .attr('height', innerHeight);
        // const svg = d3.create("svg")
        // .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);


    }, []);

    //update chart effect
    useEffect(() => {
        const svg = d3.select(lineRef.current);
        // const svg = d3.create("svg")
        // .attr("viewBox", [0, 0, width, height]);



        const group = svg.append("g");

        let rect = group.selectAll("rect");

        chartUpdate(sliderValue, svg, rect, group)
        setTotalProfitByDay(calcProfitFromCurrentDate(sliderValue))
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
            const boundingRect = lineRef.current.getBoundingClientRect();

            if (boundingRect.bottom <= (window.innerHeight || document.documentElement.clientHeight))  {
                // setPlay(false);
            }
        }

        // Add an event listener for the scroll event
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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

    return (
        <Box paddingLeft={10} paddingRight={10}>
            <Box display="flex" paddingTop={10} justifyContent="center">
                <Typography id="non-linear-slider" variant="h4" gutterBottom>
                    Profit By Day over Time 
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
                <Typography id="non-linear-slider" variant="h4" gutterBottom>
                    <CurrencyFormat value={totalProfitByDay} displayType={'text'} thousandSeparator={true} prefix={'💲'} />
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
                        getAriaValueText={valuetext}
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

            <svg ref={lineRef} />
            <DayTooltip
                left={tooltipState.left}
                top={tooltipState.top}
                fields={tooltipState.fields}
                data={tooltipState.data} />
        </Box>

    )
}
export default ProfitOverTime;



