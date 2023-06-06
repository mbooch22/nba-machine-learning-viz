import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GlobalStyles } from './components/GlobalStyles';
import Home  from './components/Home';
import About from './components/About';
import ResponsiveAppBar from './components/NavBar';
import NotFound from './components/NotFound';
import TeamPage from './components/TeamPage/TeamPage';
import DatePage from './components/DatePage/DatePage';
import GamePage from './components/GamePage';
import GithubCorner from 'react-github-corner';
import Box from '@material-ui/core/Box';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Box display="flex" justifyContent="center">
        <ResponsiveAppBar/>
      </Box>
      <Routes>
        <Route exact path="/nba-machine-learning-viz" element={<Home/>} />
        <Route path="/nba-machine-learning-viz/about" element={<About/>} />
        <Route path='/nba-machine-learning-viz/game/:gameID' element={<GamePage/>} />
        <Route path='/nba-machine-learning-viz/team/:teamAbr' element={<TeamPage />} />
        <Route path='/nba-machine-learning-viz/date/:dateID' element={<DatePage />} />
        <Route path='/nba-machine-learning-viz/*' element={<NotFound  />} />
      </Routes>
    </Router>
  );
}

export default App;
