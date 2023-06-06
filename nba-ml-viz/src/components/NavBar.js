import React, { useEffect, useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { useNavigate } from "react-router-dom";
import Popover from 'react-awesome-popover';
import TeamsSection from './TeamsSections';
import styled from 'styled-components';


const pages = [{ Text: 'Home', link: "/nba-machine-learning-viz/" }, { Text: 'About', link: "/nba-machine-learning-viz/about" }];

const StyledPopover = styled.div`
    width: ${window.innerWidth/2}px;
`;

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const clickMeButtonRef = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleClick = (link) => {
    navigate(link)
  };


  return (
    <AppBar position="sticky">
        <Toolbar  >
          <Box >
            {pages.map((page) => (
              <Button color="inherit" onClick={() => handleClick(page.link)}
                key={page.Text}
              >
                <Typography >
                  {page.Text}
                </Typography>
              </Button>
            ))}
          </Box>
          <Box >
            <Popover placement={"bottom-start"} >
              <Button ref={clickMeButtonRef} color="inherit" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                <Typography >Teams</Typography>
              </Button>
              <StyledPopover>
                <Box >
                  <TeamsSection />
                </Box>
              </StyledPopover>
            </Popover>


          </Box>
        </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;
