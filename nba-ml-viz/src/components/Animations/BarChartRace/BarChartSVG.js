import React, { useEffect, useRef, useState } from 'react';
import { generateDataSets } from "./dataGenerator";
import { BarChartRace } from "./BarChartRace";
import bar_data from '../../../data/bardata.json'

import { select as d3Select } from "d3";


const BarChartSVG = (props) => {
    const myChart = new BarChartRace("bar-chart-race");
    const data = bar_data;
    myChart
        .setTitle("Bar Chart Race Title")
        .addDatasets(data)
        .render();
    d3Select("button").on("click", function () {
        if (this.innerHTML === "Stop") {
            this.innerHTML = "Resume";
            myChart.stop();
        } else if (this.innerHTML === "Resume") {
            this.innerHTML = "Stop";
            myChart.start();
        } else {
            this.innerHTML = "Stop";
            myChart.render();
        }
    });
    return (
        <>
            <button>Stop</button>
            <svg id="bar-chart-race">
                <g className="chart-container">
                    <text className="chart-title"></text>
                    <g className="x-axis"></g>
                    <g className="y-axis"></g>
                    <g className="columns"></g>
                    <text className="current-date"></text>
                </g>
            </svg>
        </>
    )
}

export default BarChartSVG;