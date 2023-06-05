import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { cards } from '../../data/cards'
import Card from '../CommonHome/Card';
import Hero from '../CommonHome/Hero';
import parse from 'html-react-parser';
import CircleFunctions from '../../model/CircleFunctions';
import { useNavigate } from "react-router-dom";
import GameTooltip from '../CommonHome/GameTooltip';
import AutoCarousel from './AutoCarousel';
import GroupHeader from './GroupHeader';
import Profit from '../CommonHome/Profit';
import Box from '@material-ui/core/Box';


const StyledMoreInfo = styled.div`
    padding-top: 50%;
    .row {
    display: flex;
    flex-wrap: wrap;
  }
  .column {
    display: flex;
    flex: 1 1 auto;
    padding: 10px;
    width: 100%;
    @media screen and (min-width: 980px) {
      width: 33.33333333333333%;
    }
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: black;
  }

  .card-body {
    margin-top: 27px;
    margin-bottom: 27px;
    line-height: 1.5;
    font-size: 16px;
    @media screen and (min-width: 576px) {
      font-size: 18px;
    }
    color: black;


}
`;

const MoreInfoSection = (props) => {
    const { data, scrollSection, setScrollSection, settings } = props;
    const navigate = useNavigate();
    const [tooltipState, setTooltipState] = useState({ top: 0, left: 0, fields: [], data: {} })
    const [groupComponents, setGroupComponents] = useState([]);
    const moreInfoCards = cards.filter(card => card.name.includes('info'));
    const moreInfoRef = useRef(null);
    const circlesRef = useRef(null);
    let width = settings.width;
    let height = settings.height;

    useEffect(() => {
        // if (document.body.clientWidth !== 0) width = document.body.clientWidth - 100;
        // if (document.body.clientHeight !== 0) height = document.body.clientWidth;
        const svg = d3.select(circlesRef.current)
            .attr('width', width)
            .attr('height', height);







    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const boundingRect = moreInfoRef.current.getBoundingClientRect();

            if ((boundingRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) && scrollSection !== "MOREINFO") {
                //TODO - add check to see if already sorted
                setScrollSection("MOREINFO");

                const svg1 = d3.select('#svg1');
                const svg2 = d3.select('#svg2');

                const svg = d3.select(circlesRef.current);
                const circles1 = svg1.selectAll('circle')
                    .data(data);

                const circles2 = svg2.selectAll('circle')
                    .data(data);



                circles1.exit().remove();


                //Move Other Circles
                CircleFunctions.moveCirclesDownCenter(svg1, width, height, settings);


                // Use D3's transition function to smoothly animate the circles to their new positions
                // Sort the circles by size and group them in a grid
                // Use the circle elements to draw the circles on the screen
                CircleFunctions.drawCirclesFromDataSorted(svg, data, setTooltipState, navigate, width, height, settings);

            }
        }



        // Add an event listener for the scroll event
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [data, height, moreInfoRef, navigate, scrollSection, setScrollSection, width]);

    const onChangeFilter = (index) => {
        const i_mapping = {
            0: "sortProfit",
            1: "sortByHomeTeam",
            2: "sortByWins"
        }
        const svg = d3.select(circlesRef.current);
        switch (i_mapping[index]) {
            case "sortProfit":
                CircleFunctions.moveCirclesSorted(svg, width, height, settings);
                setGroupComponents([])
                break
            case "sortByHomeTeam":
                const groups = CircleFunctions.moveByHomeTeam(svg, width, height, settings);
                setGroupComponents(Array.from(groups).map(group => (
                    <GroupHeader key={group[0]} teamName={group[0]} games={group[1]} size={settings.iconSize} />
                )))
                break
            case "sortByWins":
                const { profits, winLossGroups } = CircleFunctions.moveCirclesWinLoss(svg, width, height, settings);
                setGroupComponents([profits.map((d, i) => (
                    <Profit key={i} i={i} profit={d} groups={winLossGroups.get("win")} width={width} height={height} adjust={settings.profitAdjust} />
                ))])
                break
            default:
                setGroupComponents([])
                break
        }
    };

    return (
        <StyledMoreInfo>
            <Box display="flex" paddingTop={10} justifyContent="center">
                <Hero>
                    <div className="row">
                        {moreInfoCards.map((card, i) => (
                            <div key={card.name} className="column">
                                <Card>
                                    <div className="card-title">{card.title}</div>
                                    <div className="card-body">{parse(card.description)}</div>
                                    {/* <Image ratio={card.imageRatio} src={card.image} /> */}
                                </Card>
                            </div>
                        ))}
                    </div>
                </Hero>
                <div ref={moreInfoRef}></div>
            </Box>
            <Box display="flex" paddingTop={1} justifyContent="center">
                <AutoCarousel scrollSection={scrollSection} onChangeFilter={onChangeFilter} />
            </Box>
            <Box display="flex" paddingTop={1} justifyContent="center">
                <svg id="svg2" ref={circlesRef}>
                    {groupComponents}
                </svg>
            </Box>
            <GameTooltip
                left={tooltipState.left}
                top={tooltipState.top}
                fields={tooltipState.fields}
                data={tooltipState.data} />
        </StyledMoreInfo>
    )
};

export default MoreInfoSection;
