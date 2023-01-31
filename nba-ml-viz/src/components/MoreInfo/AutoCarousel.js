import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Slider from "react-slick";
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    card: {
        paddingLeft: 10, 
        paddingRight: 10,
        width: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",    
    }
  });

const SlideContainer = styled.div`
  padding-top: 40px;
  position: absolute;
  left: 25%;
  width: 50%;
  .card-carousel-class {
    padding-left: 10px;
    padding-right: 10px;
  }
`
const StyledCard = styled.div`
    padding-left: 10px;
    padding-right: 10px;
    width: 80%;
`

const AdvancedCarousel = ({onChangeFilter, scrollSection}) => {
    const classes = useStyles();
    let sliderRef = useRef(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        centerPadding: "200px",
        className: "card-carousel-class",
        // autoplay: true, 
        // autoplaySpeed: 5000,
        afterChange: onChangeFilter
    };

    useEffect(() => {
        sliderRef.slickGoTo(0)
    }, [scrollSection]);

    return (
        <SlideContainer>
            <Slider ref={slider => (sliderRef = slider)} {...settings}>
                <StyledCard>
                    <Card  className={classes.card}>
                        <CardContent>
                            Sort Smallest profit to Largest
                        </CardContent>
                    </Card>
                </StyledCard>
                <StyledCard>
                    <Card  className={classes.card} >
                        <CardContent>
                            Sort By Home Team
                        </CardContent>
                    </Card>
                </StyledCard>
                <StyledCard>
                    <Card  className={classes.card}>
                        <CardContent>
                            Sort Between Wins and Losses
                        </CardContent>
                    </Card>
                </StyledCard>
            </Slider>
        </SlideContainer>

    );
};

export default AdvancedCarousel;