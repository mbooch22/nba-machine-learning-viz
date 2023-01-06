import React from 'react';
import styled from 'styled-components';
import { cards } from '../data/cards'
import Card from './CommonHome/Card';
import Hero from './CommonHome/Hero';

const StyledTitle = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    
    z-index: 1;
    text-align: center;
    align-items: center;

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

const Title = ({ title }) => {
    const titleCard = cards.filter(card => card.name === 'Title');
    return (
        <StyledTitle>
            <Hero>
                <div className="row">
                    {titleCard.map((card, i) => (
                        <div key='titleCard' className="column">
                            <Card>
                                <div className="card-title">{card.title}</div>
                                <div className="card-body">{card.description}</div>
                                {/* <Image ratio={card.imageRatio} src={card.image} /> */}
                            </Card>
                        </div>
                    ))}
                </div>
            </Hero>
        </StyledTitle>
    )
};

export default Title;
