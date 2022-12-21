import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

const pages = [{Text: 'Home', link: "/"}, {Text: 'About', link: "/about"}];


function ResponsiveAppBar() {


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link to={page.link}>
                <Button
                key={page.Text}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.Text}
                

                </Button>
              </Link>
            ))}
          </Box>


        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
