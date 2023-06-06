import * as d3 from "d3";
// load the data
import gamesJson from '../data/games.json';
import DataFunctions from './DataFunctions';

const BarChartFunctions = {
    generateBarData(teamName, width, height) {
        const gamesFormatted = DataFunctions.getWinsLosses(gamesJson);
        const gamesFiltered = gamesFormatted.filter(d => d["Home Team"] === teamName || d["Away Team"] === teamName);
        return gamesFiltered.map((d, i) => {
            return {
                index: i,
                date: new Date(d.Date),
                totalProfit: d.totalProfit,
                winsOnly: d.winsOnly,
                lossesOnly: d.lossesOnly,
                totalWins: d.totalWins,
                id: (d.Date + d.Name).toString().replaceAll(" ", ""),
                data: d
            }
        })
    },
    drawRectsFromData(svg, data, width, height, setTooltipState, navigate) {
        const xValue = d => d.date;
        const yValue = d => d.totalProfit;

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);


        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue)).nice()
            .range([innerHeight, 0]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        g.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', d => xScale(xValue(d)))
            .attr('y', innerHeight / 2)
            .attr('height', 0)
            .attr('width', 20)
            .style('fill', d => yValue(d) < 0 ? 'red' : 'green')
            .transition()
            .duration(1000)
            .attr('y', d => yScale(Math.max(0, yValue(d))))
            .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)));

        svg.selectAll('rect')
            .on("mouseover", d => {
                setTooltipState({
                    top: (d.pageY - 10) + "px",
                    left: (d.pageX + 10) + "px",
                    fields: [
                        `Title: ${d.currentTarget.__data__.data.Name}`,
                    ],
                    data: d.currentTarget.__data__.data
                });
            })
            .on("mouseout", () => {
                setTooltipState({
                    fields: [],
                    data: {}
                });
            })
            .on("click", d => {
                navigate(`/nba-machine-learning-viz/game/${d.currentTarget.__data__.id}`)
            });


        g.append('g').call(d3.axisLeft(yScale));
        g.append('g').call(d3.axisBottom(xScale))
            .attr('transform', `translate(0, ${innerHeight})`);
    },
    moveRectsHomeAway(svg, width, height, teamName, data, setTooltipState, navigate) {
        //Clear Current Chart
        svg.selectAll("*").remove();

        const xValue = d => d.date;
        const yValue = d => d.totalProfit;

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([innerWidth/2 + 30, innerWidth]);
        const xScale2 = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth/2]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue)).nice()
            .range([innerHeight, 0]);



        const teamGroups = d3.group(data, d => d.data["Home Team"] === teamName ? "Home" : "Away");
        // //set Y position for each group based on index
        teamGroups.forEach((group, key, index) => {
            let g = svg.append('g')
                .attr('transform', `scale(1, 1), translate(${margin.left}, ${margin.top})`)
            g.selectAll('rect')
                .data(group)
                .enter().append('rect')
                .attr('x', d => key === "Home" ? xScale2(xValue(d)) : xScale(xValue(d)))
                .attr('y', innerHeight / 2)
                .attr('height', 0)
                .attr('width', 10)
                .style('fill', d => yValue(d) < 0 ? 'red' : 'green')
                .transition()
                .duration(1000)
                .attr('y', d => yScale(Math.max(0, yValue(d))))
                .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)));

                g.append('g').call(d3.axisLeft(yScale))
                    .attr('transform', `translate(${key === "Home" ? innerWidth/2 +30 : 0}, 0)`);
                g.append('g').call(d3.axisBottom(key === "Home" ? xScale2 : xScale))
                    .attr('transform', `translate(0, ${innerHeight})`);
        })



        svg.selectAll('rect')
            .on("mouseover", d => {
                setTooltipState({
                    top: (d.pageY - 10) + "px",
                    left: (d.pageX + 10) + "px",
                    fields: [
                        `Title: ${d.currentTarget.__data__.data.Name}`,
                    ],
                    data: d.currentTarget.__data__.data
                });
            })
            .on("mouseout", () => {
                setTooltipState({
                    fields: [],
                    data: {}
                });
            })
            .on("click", d => {
                navigate(`/nba-machine-learning-viz/game/${d.currentTarget.__data__.id}`)
            });





        // rects.transition()
        //     .duration(1000)
        //     .attr('x', d => d.x)

        // return teamGroups;
    },
    moveRectsWinLoss(svg, width, height, teamName, data, setTooltipState, navigate) {

        const xValue = d => d.date;
        const yValue = d => d.totalProfit;

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([innerWidth/2 + 30, innerWidth]);
        const xScale2 = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth/2]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue)).nice()
            .range([innerHeight, 0]);



        const teamGroups = d3.group(data, d => d.data.totalProfit > 0 ? "win" : "loss");
        // //set Y position for each group based on index
        teamGroups.forEach((group, key, index) => {
            let g = svg.append('g')
                .attr('transform', `scale(1, 1), translate(${margin.left}, ${margin.top})`)
            g.selectAll('rect')
                .data(group)
                .enter().append('rect')
                .attr('x', d => key === "win" ? xScale2(xValue(d)) : xScale(xValue(d)))
                .attr('y', innerHeight / 2)
                .attr('height', 0)
                .attr('width', 10)
                .style('fill', d => yValue(d) < 0 ? 'red' : 'green')
                .transition()
                .duration(1000)
                .attr('y', d => yScale(Math.max(0, yValue(d))))
                .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)));

                g.append('g').call(d3.axisLeft(yScale))
                    .attr('transform', `translate(${key === "win" ? innerWidth/2 +30 : 0}, 0)`);
                g.append('g').call(d3.axisBottom(key === "win" ? xScale2 : xScale))
                    .attr('transform', `translate(0, ${innerHeight})`);
        })



        svg.selectAll('rect')
            .on("mouseover", d => {
                setTooltipState({
                    top: (d.pageY - 10) + "px",
                    left: (d.pageX + 10) + "px",
                    fields: [
                        `Title: ${d.currentTarget.__data__.data.Name}`,
                    ],
                    data: d.currentTarget.__data__.data
                });
            })
            .on("mouseout", () => {
                setTooltipState({
                    fields: [],
                    data: {}
                });
            })
            .on("click", d => {
                navigate(`/nba-machine-learning-viz/game/${d.currentTarget.__data__.id}`)
            });





        // rects.transition()
        //     .duration(1000)
        //     .attr('x', d => d.x)

        // return teamGroups;
    }
    , moveRectsOriginal(svg, width, height, teamName) {
        const rects = svg
            .selectAll('rect');
        const xValue = d => d.date;
        const yValue = d => d.totalProfit;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const data = BarChartFunctions.generateBarData(teamName, width, height)
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);


        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue)).nice()
            .range([innerHeight, 0]);

        rects.transition()
            .duration(1000)
            .attr('x', d => xScale(xValue(d)))
            .attr('y', d => yScale(Math.max(0, yValue(d))))
            .attr('height', d => Math.abs(yScale(yValue(d)) - yScale(0)));
    },
}
export default BarChartFunctions;