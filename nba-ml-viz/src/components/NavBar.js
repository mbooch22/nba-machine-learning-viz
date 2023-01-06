import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const pages = [{Text: 'Home', link: "/"}, {Text: 'About', link: "/about"}];


function ResponsiveAppBar() {


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link to={page.link} key={page.Text}>
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
