import _ from 'lodash';
import * as d3 from "d3";

import gamesJson from '../data/games.json';

const DataFunctions = {
    getWinsLosses (games, moneyLine = true){
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
                    if (games[i]["Winner"] === "A"){
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
            games[i].totalProfit = Math.round((profitWins * 91 ) - (profitLosses * 100));
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
        
        const wins =  _.sumBy(data, function(d) { return d.data.winsOnly; });
        const losses = _.sumBy(data, function(d) { return d.data.lossesOnly; });

        return [wins, losses];
    },

    getTotalProfit(data) {
        const profit =  _.sumBy(data, function(d) { return d.data.totalProfit; });
        return profit;
    },
    
    getCircleObjectProfit(data){
        return data.data.totalProfit;
    }
}

export default DataFunctions;

