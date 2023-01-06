import { createGlobalStyle } from 'styled-components';

const theme = {
    primaryColor: 'grey',
    secondaryColor: 'white',
  };
  

  export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: ${theme.primaryColor};
    --secondary-color: ${theme.secondaryColor};
  }

  body {
    font-family: sans-serif;
    color: #333;
    background-color: var(--primary-color);
  }
  nav {
    display: flex;
    justify-content: space-evenly;
    color: ${theme.primaryColor};
    text-decoration: none;
    hover: {
        color: ${theme.secondaryColor};
    }
  }
`;
