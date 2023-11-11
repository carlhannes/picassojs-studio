import { SettingsType } from '@/core/types';
import { Box } from '@/ui/box';
import { Divider } from '@/ui/divider';
import { FormControl, FormLabel, MenuItem, Select } from '@/ui/form-controls';
import React from 'react';

export type SettingsAreaProps = {
  settings: SettingsType;
  onSettingsChanged: (newSettings: SettingsType) => void;
};

const SettingsArea = ({ settings, onSettingsChanged }: SettingsAreaProps) => {
  // const [state, setState] = React.useState(settings);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
      const { 
        name, 
        value, 
        // @ts-ignore
        checked 
      } = event.target;
      const paths = name.split('.');
      const lastPath = paths.splice(paths.length - 1, 1);
      const newSettings = { ...settings };
      // @ts-ignore
      const prop = paths.reduce((p, c) => p[c], newSettings);
      // @ts-ignore
      prop[lastPath] = typeof checked !== 'undefined' ? checked : value;
      onSettingsChanged(newSettings);
    },
    [onSettingsChanged, settings]
  );

  // const { chart, compose } = settings.api;
  const { renderer, logger } = settings;

  return (
    <Box display="flex" flexGrow={1} flexDirection="column" style={{
      marginTop: '4rem',
      margin: 'auto',
    }}>
      {/* <FormControl style={{ marginTop: '4rem' }}>
        <FormLabel>Picasso API&apos;s</FormLabel>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={chart} onChange={handleChange} name="api.chart" color="primary" />}
            label="Chart API"
          />
          <FormControlLabel
            control={<Checkbox checked={compose} onChange={handleChange} name="api.compose" color="primary" />}
            label="Compose API"
          />
        </FormGroup>
      </FormControl> */}
      <Divider />
      <Box display="flex">
        <FormControl style={{ marginTop: '4rem' }}>
          <FormLabel>Renderer</FormLabel>
          <Select labelId="renderer-select" value={renderer.prio[0]} name="renderer.prio.0" onChange={handleChange}>
            <MenuItem value="svg">SVG</MenuItem>
            <MenuItem value="canvas">Canvas</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Box display="flex">
        <FormControl style={{ marginTop: '4rem' }}>
          <FormLabel>Logging Level</FormLabel>
          <Select labelId="logger-select" value={logger} name="logger" onChange={handleChange}>
            <MenuItem value={0}>off</MenuItem>
            <MenuItem value={1}>error</MenuItem>
            <MenuItem value={2}>warning</MenuItem>
            <MenuItem value={3}>info</MenuItem>
            <MenuItem value={4}>debug</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SettingsArea;
