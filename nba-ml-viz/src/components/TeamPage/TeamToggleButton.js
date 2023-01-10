import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default function ToggleButtons({alignment, handleAlignment}) {
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <span>Home and Away</span>
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <span>All Games</span>
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <span>Wins and Losses</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}