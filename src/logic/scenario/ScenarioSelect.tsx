import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';

import { allScenariosState, scenarioSlugState } from './scenario-state';

export const ScenarioSelect = () => {
  const allScenarios = useRecoilValue(allScenariosState);

  const [scenarioSlug, setScenarioSlug] = useRecoilState(scenarioSlugState);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Scenario</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={scenarioSlug}
        label="Scenario"
        onChange={(e) => setScenarioSlug(e.target.value)}
      >
        {allScenarios.map((sc) => (
          <MenuItem key={sc.slug} value={sc.slug}>
            {sc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
