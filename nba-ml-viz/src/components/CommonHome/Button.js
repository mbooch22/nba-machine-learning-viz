import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Buttons = ({handleClick, text, color}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <Button variant="contained" color={color} onClick={handleClick}>
            {text}
        </Button>
        </div>
    )
}
export default Buttons;