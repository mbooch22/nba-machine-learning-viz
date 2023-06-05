import * as d3 from "d3";
import * as NBAIcons from 'react-nba-logos';
// load the data
import teamsJson from '../data/teams.json';
import gamesJson from '../data/games.json';
import DataFunctions from './DataFunctions';

const CircleFunctions = {

    generateCircleData(width, height, settings) {
        const gamesFormatted = DataFunctions.getWinsLosses(gamesJson);
        const gamesWonMinMax = d3.extent(gamesFormatted, d => d.totalProfit);
        const sizeScale = d3.scaleLinear(gamesWonMinMax).range(settings.aSize);
        const games = gamesFormatted.map(d => {
            const r = sizeScale(d.totalWins);
            const TeamIcon = NBAIcons[teamsJson.find(t => t.teamName === d["Home Team"]).abbreviation];
            return {
                x: Math.random() * (width - settings.xAdjustCircles[0]) + settings.xAdjustCircles[1],
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
    },

    drawCirclesFromDataSorted(svg, data, setTooltipState, navigate, width, height, settings) {
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
            .attr('cx', (d, i) => (i % settings.xAdjustMoreInfo1[0]) * width / settings.xAdjustMoreInfo1[0] + settings.xAdjustMoreInfo1[2])
            .attr('cy', (d, i) => Math.floor(i / settings.xAdjustMoreInfo1[0]) * height / settings.xAdjustMoreInfo1[0] + settings.xAdjustMoreInfo1[2]);
    },
    moveCirclesRandom(svg, data, width, height, settings) {
        const circles = svg.selectAll('circle').data(data);


        circles
            .transition()
            .duration(2000)
            .attr('cx', d => Math.random() * (width - settings.xAdjustCircles[0]) + settings.xAdjustCircles[1])
            .attr('cy', d => Math.random() * height)
            .attr('r', d => d.r)
            .attr('fill', d => d.color);
    },
    moveCirclesDownCenter(svg, width, height, settings) {
        const circles = svg
            .selectAll('circle')

        circles
            .transition()
            .duration(2000)
            .attr('r', d => 0)
            .attr('cx', d => d.x)
            .attr('cy', d => height + settings.yAdjustMoreInfo);

    },
    moveCirclesSorted(svg, width, height, settings) {
        const circles = svg
            .selectAll('circle');
        circles
            .sort((a, b) => d3.ascending(a.totalProfit, b.totalProfit))
            .transition()
            .duration(3000)
            .attr('r', d => d.r)
            .attr('fill', d => d.color)
            .attr('cx', (d, i) => (i % settings.xAdjustMoreInfo1[0]) * width / settings.xAdjustMoreInfo1[0] + settings.xAdjustMoreInfo1[3])
            .attr('cy', (d, i) => Math.floor(i / settings.xAdjustMoreInfo1[0]) * height / settings.xAdjustMoreInfo1[2] + settings.xAdjustMoreInfo1[1]);
    },
    moveCirclesWinLoss(svg, width, height, settings) {
        let totalProfit = 0;
        let totalLoss = 0;
        const circles = svg
            .selectAll('circle');

        //group circles 
        const winLossGroups = d3.group(circles.data(), d => d.data.totalProfit > 0 ? "win" : "loss");

        //Set x position for each group
        winLossGroups.forEach((group, key) => {
            const xPos = key === 'win' ? width / 4 : width / 2;
            const newKey = key;
            group.forEach((circle, i) => {
                circle.x = (i % 15) * width / 4 / (15) + xPos + settings.moveCirclesWinLoss[0];
                circle.y = Math.floor(i / 15) * height / 25 + settings.moveCirclesWinLoss[1];
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
        return { profits: [totalProfit, totalLoss, total], winLossGroups: winLossGroups };

    },
    moveCirclesWinLossTeamPage(svg, width, height, settings) {
        let totalProfit = 0;
        let totalLoss = 0;
        const circles = svg
            .selectAll('circle');

        //group circles 
        const winLossGroups = d3.group(circles.data(), d => d.data.totalProfit > 0 ? "win" : "loss");

        //Set x position for each group
        winLossGroups.forEach((group, key) => {
            const newX = key === 'win' ? 1 / 4 : 1 / 2;
            const xPos = width * newX

            const newKey = key;
            group.forEach((circle, i) => {
                circle.x = (i % 5) * width / (25) + xPos + settings.moveCirclesWinLoss[0];
                circle.y = Math.floor(i / 5) * height / 10 + settings.moveCirclesWinLoss[1];
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
        return { profits: [totalProfit, totalLoss, total], groups: winLossGroups };

    },
    moveByHomeTeam(svg, width, height, settings) {
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
            const yPos = i * settings.moveByHomeTeam[0] + settings.moveByHomeTeam[1];
            group.forEach((circle, i) => {
                circle.y = yPos;
                circle.x = (i % settings.moveByHomeTeam[2]) * width / settings.moveByHomeTeam[3] + settings.moveByHomeTeam[4]
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
    moveCirclesHomeAway(svg, width, height, teamName) {
        const circles = svg
            .selectAll('circle');
        const sortedCircles = circles.data().sort(function (a, b) {
            const indexA = a.data["Home Team"] === teamName ? 1 : 5
            const indexB = b.data["Home Team"] === teamName ? 1 : 5
            return indexA - indexB
        })
        const teamGroups = d3.group(sortedCircles, d => d.data["Home Team"] === teamName ? "Home" : "Away");
        //set Y position for each group based on index
        let i = 0;
        teamGroups.forEach((group, key, index) => {
            const newX = i === 0 ? 1 / 4 : 1 / 2;
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