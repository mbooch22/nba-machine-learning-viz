import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom'
import { GlobalStyles } from './components/GlobalStyles';
import Home  from './components/Home';
import About from './components/About';
import ResponsiveAppBar from './components/NavBar';


function App() {
  return (
    <Router>
      <GlobalStyles />
      <ResponsiveAppBar/>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </Router>
  );
}

export default App;
