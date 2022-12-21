import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';

const Buttons = ({handleClick, text, color}) => {
    return (
        <>
        <Button variant="contained" color={color} onClick={handleClick}>
            {text}
        </Button></>
    )
}
export default Buttons;