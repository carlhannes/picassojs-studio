import extend from 'extend';
import randomSeed from 'random-seed';
import * as customGenerator from './custom-generator';
import hypercubeGenerator from './hypercube-generator';

function quickHypercube(props) {
  const defaultVars = {
    dimensions: 2,
    measures: 6,
    rows: 40,
    dataRange: [10, 90],
    sorted: false,
    sortAlphabetically: false,
    seed: 1337,
  };

  const variables = extend({}, defaultVars, props || {});
  variables.randomizer = randomSeed(variables.seed).random;

  const teamData = customGenerator.generateTeamNameData(variables);

  const qLayout = hypercubeGenerator.generateDataFromArray(teamData);

  const data = [{
    type: 'q',
    key: 'qHyperCube',
    data: qLayout.qHyperCube,
  }];

  return data;
}

quickHypercube.customGenerator = customGenerator;
quickHypercube.hypercubeGenerator = hypercubeGenerator;

export default quickHypercube;
