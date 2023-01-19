import _ from 'lodash';
import * as d3 from "d3";

import gamesJson from '../data/games.json';
import teamsJson from '../data/teams.json';

const DataFunctions = {
    getWinsLosses(games, moneyLine = true) {
        let wins = 0;
        let losses = 0;
        for (let i = 0; i < games.length; i++) {
            wins = 0;
            losses = 0;
            let profitWins = 0;
            let profitLosses = 0;
            if (games[i]["BET SPREAD"] === "W") {
                wins++;
                profitWins++;
            } else if (games[i]["BET SPREAD"] === "L") {
                losses++;
                profitLosses++;
            }
            if (games[i]["BET TOTAL"] === "W") {
                wins++;
                profitWins++;
            } else if (games[i]["BET TOTAL"] === "L") {
                losses++;
                profitLosses++;
            }
            if (games[i]["BET HOME"] === "W") {
                wins++;
                profitWins++;
            } else if (games[i]["BET HOME"] === "L") {
                losses++;
                profitLosses++;
            }
            if (games[i]["BET AWAY"] === "W") {
                wins++;
                profitWins++;
            } else if (games[i]["BET AWAY"] === "L") {
                losses++;
                profitLosses++;
            }
            if (moneyLine) {
                if (games[i]["BET WIN"] === "W") {
                    wins++;
                    let oddsPercent = parseFloat(games[i]["Vegas MoneyLine Odds"].split("%")[0]);
                    if (games[i]["Winner"] === "A") {
                        oddsPercent = 100 - oddsPercent;
                    }
                    let moneyWon = this.oddsConverter(oddsPercent);
                    let fractionOfMoney = moneyWon / 91;
                    profitWins = profitWins + fractionOfMoney;
                } else if (games[i]["BET WIN"] === "L") {
                    losses++;
                    profitLosses++;
                }
            }

            games[i]["Date"] = games[i]["Date"].substring(0, 10);
            games[i].totalProfit = Math.round((profitWins * 91) - (profitLosses * 100));
            games[i].winsOnly = wins;
            games[i].lossesOnly = losses;

            games[i].totalWins = wins - losses;

        }
        return games;
    },

    oddsConverter(odds) {
        odds = odds / 100; //get percent
        if (odds < 50) {
            //For ‘plus’ moneylines, the formula is: 100 / (Moneyline + 100)
            let moneyline = (100 / odds) - 100;
            return parseInt(moneyline);
        } else if (odds > 50) {
            //For ‘minus’ moneylines, the formula is: Moneyline / -(100 – (Moneyline))
            //  -100*odds / (odds-1)
            let moneyline = parseInt(-(100 * odds) / (odds - 1));
            let moneyWon = 10000 / moneyline
            return parseInt(moneyWon);

        }
    },

    getTotalWins(data) {

        const wins = _.sumBy(data, function (d) { return d.data.winsOnly; });
        const losses = _.sumBy(data, function (d) { return d.data.lossesOnly; });

        return [wins, losses];
    },

    getTotalProfit(data) {
        const profit = _.sumBy(data, function (d) { return d.data.totalProfit; });
        return profit;
    },

    getCircleObjectProfit(data) {
        return data.data.totalProfit;
    },
    getDatesForSlider() {
        const games =[...new Set(gamesJson.map(item => new Date(item.Date).toDateString()))]
        const dates = games.map((d, i) => {
            return {
                'date': d,
                'i': i
            }

        });
        return _.orderBy(dates, i => new Date(i.date), 'asc');
    }, 
    getDatesForSliderPerTeam(teamName) {
        const games =[...new Set(gamesJson.filter(game => game["Home Team"] === teamName || game["Away Team"] === teamName).map(item => new Date(item.Date).toDateString()))]
        const dates = games.map((d, i) => {
            return {
                'date': d,
                'i': i
            }

        });
        return _.orderBy(dates, i => new Date(i.date), 'asc');
    }, 
    getProfitByDatePerTeam(teamName){
        const games = this.getWinsLosses(gamesJson.filter(game => game["Home Team"] === teamName || game["Away Team"] === teamName));
        const uniqueDates = this.getDatesForSliderPerTeam(teamName)
        const profitByDate = uniqueDates.map((d, i) => {
            return {
                'date': d.date,
                'i': i,
                'totalProfit': this.getGamesProfitByDate(games, d.date)
            }
        })
        return profitByDate;
    },

    getProfitByDate() {
        const games = this.getWinsLosses(gamesJson);
        const uniqueDates = this.getDatesForSlider()
        const profitByDate = uniqueDates.map((d, i) => {
            return {
                'date': d.date,
                'i': i,
                'totalProfit': this.getGamesProfitByDate(games, d.date)
            }
        })
        return profitByDate;
    },
    getGamesProfitByDate(games, date) {
        let totalProfit = 0
        totalProfit = _.sumBy(games, function(d) { if(new Date(d.Date).toDateString() === date) return d.totalProfit; });
        return totalProfit
    },
    getTeamProfitByDates() {
        const teamProfitByDate = {}
        const games = this.getWinsLosses(gamesJson);
        const uniqueDates = this.getDatesForSlider();
        uniqueDates.forEach((d,i) => {
            teamProfitByDate[i] = this.getTeamProfitforDate(games, d.date, teamProfitByDate[i-1] ? teamProfitByDate[i-1] : null, i-1);
        })
        return teamProfitByDate;
    },
    getTeamProfitforDate(games, date, teamProfit, index){
        const teams = []
        let profit = 0;
        const dateGames = games.filter(d => new Date(d.Date).toDateString() === date)
        teamsJson.forEach((team, i) => {
            let currProfit = teamProfit ? teamProfit.find(d => d.team === team.abbreviation).totalProfit : 0
            profit = _.sumBy(dateGames.filter(d => d["Home Team"] === team.teamName || d["Away Team"] === team.teamName), 'totalProfit')
            teams.push({ date: date, team: team.abbreviation, totalProfit : profit ? profit+currProfit : currProfit})
        })
        return teams;
    }
}

export default DataFunctions;

