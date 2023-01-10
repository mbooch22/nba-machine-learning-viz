import _ from 'lodash';
import * as d3 from "d3";
import * as NBAIcons from 'react-nba-logos';
// load the data
import teamsJson from '../data/teams.json';
import gamesJson from '../data/games.json';
import DataFunctions from './DataFunctions';

const CircleFunctions = {

    generateCircleData(width, height) {
        const gamesFormatted = DataFunctions.getWinsLosses(gamesJson);
        const gamesWonMinMax = d3.extent(gamesFormatted, d => d.totalProfit);
        const sizeScale = d3.scaleLinear(gamesWonMinMax).range([9.5, 10.5]);
        const games = gamesFormatted.map(d => {
            const r = sizeScale(d.totalWins);
            const TeamIcon = NBAIcons[teamsJson.find(t => t.teamName === d["Home Team"]).abbreviation];
            return {
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * height,
                r: Math.abs(r),
                color: teamsJson.find(t => t.teamName === d["Home Team"]).colorHome,
                logo: TeamIcon,
                totalProfit: d.totalProfit,
                id: (d.Date + d.Name).toString().replaceAll(" ", ""),
                data: d
            };
        });
        return games
        // d3.range(numCircles).map(() => ({
        //   x: Math.random() * width,
        //   y: Math.random() * height,
        //   r: Math.random() * 20 + 10
    },


    generateCircleDataTeam(width, height, teamName) {
        const gamesFormatted = DataFunctions.getWinsLosses(gamesJson);
        const gamesWonMinMax = d3.extent(gamesFormatted, d => d.totalProfit);
        const sizeScale = d3.scaleLinear(gamesWonMinMax).range([9.5, 10.5]);
        const gamesFiltered = gamesFormatted.filter(d => d["Home Team"] === teamName || d["Away Team"] === teamName);
        const games = gamesFiltered.map(d => {
            const r = sizeScale(d.totalWins);
            return {
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * height,
                r: Math.abs(r),
                color: teamsJson.find(t => t.teamName === d["Home Team"]).colorHome,
                totalProfit: d.totalProfit,
                id: (d.Date + d.Name).toString().replaceAll(" ", ""),
                data: d
            };
        });
        return games
    },

    drawCirclesFromData(svg, data, setTooltipState, navigate) {
        // Bind the data to the SVG and create one 'circle' element per piece of data
        const circles = svg
            .selectAll('circle')
            .data(data)
            .join('circle');
        circles
            .attr('cx', d => Math.random() * d.x)
            .attr('cy', d => Math.random() * d.y)
            .attr('r', d => d.r)
            .attr('fill', d => d.color)
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
                navigate(`/game/${d.currentTarget.__data__.id}`)
            });

        circles
            .transition()
            .duration(3000)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // .append("svg:image")
        //   .attr('xlink:href', "https://loodibee.com/wp-content/uploads/nba-atlanta-hawks-logo.png")
        //   .attr("width", 40)
        // 	.attr("height", 40);
        // .append("svg") https://loodibee.com/wp-content/uploads/nba-atlanta-hawks-logo.png
        //   .append("path")
        //     .attr("d", "M101.5 86.203c3.485-7.645 1.73-15.957-4.142-22.517-1.632-1.82-3.667-3.06-5.635-4.26-1.28-.78-2.605-1.586-3.792-2.543-.557-.45-1.016-1.056-1.5-1.7-.603-.8-1.286-1.707-2.265-2.414-5.444-3.928-11.848-5.365-18.172-7.23-2.988-.878-5.896-1.53-8.633-2.5 3.377-2.342 7.723-3.855 12.46-4.316a46.06 46.06 0 0 1 4.43-.22c13.97 0 26.172 7.02 32.642 18.776 6.476 11.78 6.05 26.073-1.12 37.306-7.367 11.54-20.435 17.678-35.224 16.46-8.847-.724-18.275-5.408-21.176-10.365 1.797-1.102 17.952-9.645 29.005-6.204 3.17.01-1.9 7.665-1.9 7.665s18.446-1.52 25.025-15.938m7.657-43.188c-9.63-10.263-23.887-15.533-38.44-14.55-23.1 1.57-33.344 18.704-33.344 18.704L58.2 53.482c1.7.533 13.137 3.35 18.288 6.178 1.075.6 2.13 1.77 3.17 2.872.772.816 1.497 1.6 2.252 2.207 1.352 1.105 2.678 2.063 3.957 2.987 3.175 2.3 5.916 4.263 7.2 7.27 1.105 2.612 1.148 5.32.122 7.836-.9 2.2-2.565 4.14-4.646 5.477.2-1.1.495-2.694-1.006-3.68-.64-.418-4.095-1.23-6.407-1.46-1.105-.115-13.47-.7-30.64 8.556 5.15-6.85 8.837-8 8.837-8-.138-.826-27.775 10.342-27.775 10.342s9.533 30.464 46.432 27.227c24.006-2.1 41.9-19.622 43.46-43 .897-13.355-3.462-25.888-12.273-35.286M74.168 63.035c-5.932.234-11.386-6.878-15.963-2.22.887.224 2.7-.464 2.97.368-2.35 9.194 12.9 11.563 12.992 1.852")
        //     .attr("fill", "#fefefe")
        //     .attr('x', -9)
        //     .attr('y', -12)
        //     .attr('width', 20)
        //     .attr('height', 24)
        // .append("svg:image")
        //   // .attr('x', -9)
        //   // .attr('y', -12)
        //   // .attr('width', 20)
        //   // .attr('height', 24)
        //   .attr("fill", function(d) { console.log(d.logo(60)); return <d.logo/>; })
    },

    drawCirclesFromDataSorted(svg, data, setTooltipState, navigate, width, height) {
        // Bind the data to the SVG and create one 'circle' element per piece of data
        const circles = svg
            .selectAll('circle')
            .data(data)
            .join('circle');
        circles
            .attr('cx', d => d.x)
            .attr('cy', d => 0)
            .attr('r', d => 0)
            .attr('fill', d => d.color)
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
                navigate(`game/${d.currentTarget.__data__.id}`)
            });

        circles
            .sort((a, b) => d3.ascending(a.totalProfit, b.totalProfit))
            .transition()
            .duration(2000)
            .attr('r', d => d.r)
            .attr('fill', d => d.color)
            .attr('cx', (d, i) => (i % 25) * width / 25 + 25)
            .attr('cy', (d, i) => Math.floor(i / 25) * height / 25 + 200);
    },
    moveCirclesRandom(svg, data, width, height) {
        const circles = svg.selectAll('circle').data(data);


        circles
            .transition()
            .duration(2000)
            .attr('cx', d => Math.random() * (width - 100) + 50)
            .attr('cy', d => Math.random() * height)
            .attr('r', d => d.r)
            .attr('fill', d => d.color);
    },
    moveCirclesDownCenter(svg, width, height) {
        const circles = svg
            .selectAll('circle')

        circles
            .transition()
            .duration(2000)
            .attr('r', d => 0)
            .attr('cx', d => d.x)
            .attr('cy', d => height + 500);

    },
    moveCirclesSorted(svg, width, height) {
        const circles = svg
            .selectAll('circle');
        circles
            .sort((a, b) => d3.ascending(a.totalProfit, b.totalProfit))
            .transition()
            .duration(3000)
            .attr('r', d => d.r)
            .attr('fill', d => d.color)
            .attr('cx', (d, i) => (i % 25) * width / 25 + 50)
            .attr('cy', (d, i) => Math.floor(i / 25) * height / 25 + 200);
    },
    moveCirclesWinLoss(svg, width, height) {
        let totalProfit = 0;
        let totalLoss = 0;
        const circles = svg
            .selectAll('circle');

        //group circles 
        const winLossGroups = d3.group(circles.data(), d => d.data.totalProfit > 0 ? "win" : "loss");

        //Set x position for each group
        winLossGroups.forEach((group, key) => {
            const xPos = key === 'win' ? width / 4 : width / 2;
            const yPos = key === 'win' ? 25 : 50;
            const xAdjust = key === 'win' ? 1.5 : 1;
            const yAdjust = key === 'win' ? 1.5 : 1;

            const newKey = key;
            group.forEach((circle, i) => {
                circle.x = (i % 15) * width / 4 / (15) + xPos + 100;
                circle.y = Math.floor(i / 15) * height / 25 + 200;
                newKey === 'win' ? totalProfit += circle.data.totalProfit : totalLoss += circle.data.totalProfit
            });
        });

        //transition to new positions
        circles.transition()
            .duration(2000)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.data.totalProfit > 0 ? "green" : "rgba(255, 0, 0, 0.644)");

        const total = totalProfit - Math.abs(totalLoss)
        return [totalProfit, totalLoss, total];

    },
    moveCirclesWinLossTeamPage(svg, width, height) {
        let totalProfit = 0;
        let totalLoss = 0;
        const circles = svg
            .selectAll('circle');

        //group circles 
        const winLossGroups = d3.group(circles.data(), d => d.data.totalProfit > 0 ? "win" : "loss");

        //Set x position for each group
        winLossGroups.forEach((group, key) => {
            const newX = key === 'win' ? 1/4 : 1/2;
            const xPos = width * newX

            const newKey = key;
            group.forEach((circle, i) => {
                circle.x = (i % 5) * width / (25) + xPos + 50
                circle.y = Math.floor(i / 5) * height / 10 + 100;
                newKey === 'win' ? totalProfit += circle.data.totalProfit : totalLoss += circle.data.totalProfit
            });
        });

        //transition to new positions
        circles.transition()
            .duration(2000)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.data.totalProfit > 0 ? "green" : "rgba(255, 0, 0, 0.644)");

        const total = totalProfit - Math.abs(totalLoss)
        return [totalProfit, totalLoss, total];

    },
    moveByHomeTeam(svg, width, height) {
        const circles = svg
            .selectAll('circle');
        //group circles 
        const alphaSortData = circles.data().sort(function (a, b) {
            if (a.data["Home Team"].toLowerCase() < b.data["Home Team"].toLowerCase()) return -1;
            if (a.data["Home Team"].toLowerCase() > b.data["Home Team"].toLowerCase()) return 1;
            return 0;
        })
        const homeTeamGroups = d3.group(alphaSortData, d => d.data["Home Team"]);

        //set Y position for each group based on index
        let i = 0;
        homeTeamGroups.forEach((group, key, index) => {
            const yPos = i * 35 + 200;
            group.forEach((circle, i) => {
                circle.y = yPos;
                circle.x = (i % 25) * width / 25 + 200
            })
            i++;
        })
        circles.transition()
            .duration(2000)
            .attr('fill', d => d.color)
            .attr('cy', d => d.y)
            .attr('cx', d => d.x);

        return homeTeamGroups;
    },
    moveCirclesHomeAway(svg, width, height, teamName){
        const circles = svg
            .selectAll('circle');
        const sortedCircles = circles.data().sort(function (a, b) {
            const indexA = a.data["Home Team"] === teamName ? 1 : 5
            const indexB = b.data["Home Team"] === teamName ? 1 : 5
            return indexA - indexB
        })
        const teamGroups = d3.group(sortedCircles, d => d.data["Home Team"]===teamName ? "Home" : "Away");
        //set Y position for each group based on index
        let i = 0;
        teamGroups.forEach((group, key, index) => {
            const yPos = i * 35 + 200;
            const newY = Math.floor(i / 5) * height / 25 + 200;
            const newX = i === 0 ? 1/4 : 1/2;
            const xPos = width * newX
            group.forEach((circle, i) => {
                circle.y = Math.floor(i / 5) * height / 10 + 100;
                circle.x = (i % 5) * width / (25) + xPos + 50
            })
            i++;
        })
        circles.transition()
            .duration(2000)
            .attr('fill', d => d.color)
            .attr('cy', d => d.y)
            .attr('cx', d => d.x);

        return teamGroups;
    },
    getForceX(width, height) {
        return d3.forceX(function (d) {
            if (d.data.totalProfit > 0) {
                return 25;
            } else {
                return 75;
            }
        }).strength(0.1);
    },
    getForceY(width, height) {
        return d3.forceY(100 / 2).strength(0.1);
    },

    getForceCollide() {
        return d3.forceCollide(d => d.r + .5);
    },

}

export default CircleFunctions;