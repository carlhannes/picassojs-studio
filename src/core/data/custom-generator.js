/* eslint no-nested-ternary: 0 */
/* eslint no-confusing-arrow: 0 */
/* eslint no-mixed-operators: 0 */
/* eslint no-plusplus: 0 */
/* eslint max-len: 0 */

import hypercubeGenerator from './hypercube-generator';

const cities = ['Copenhagen', 'Malmo', 'Lund', 'Helsingborg', 'Barcelona', 'Berlin', 'Amsterdam', 'Prag', 'Paris', 'New York', 'Oslo', 'Stockholm',
  'Delhi', 'London', 'Taipei', 'Moscow', 'Shanghai', 'Tokyo', 'Jakarta', 'Seoul', 'Ho Chi Minh', 'Bangkok', 'Hong Kong', 'Rio de Janeiro', 'Singapore', 'Alexandria',
  'Los Angeles', 'Madrid', 'Buenos Aires'];

const teamNames = ['City', 'United', 'Bears', 'Cowboys', 'Rookies', 'Tigers', 'Lions', 'Bunnies',
  'Leafs', 'Hawks', 'Lazors', "Sharks with frickin' laser beams", 'Bulldogs', 'Sharks', 'Eagles', 'Redskins', 'Ranges', 'Owls', 'Spikes', 'Quakers', 'Saints', 'Seals',
  'Shrimps', 'Vikings', 'Wolves', 'Seagulls', 'Glassboys', 'Daggers', 'Addicks', 'Beavers', 'Swans', 'Meat Commission', 'and the Gang', 'Chefs', 'Pigs'];

const sportsAbbreviations = ['FC', 'Club', 'FCB', 'BC', 'Soccer Club', 'SC', 'Football Club', 'Ball Club', 'HC', 'Hockey Club', 'AC', 'Athletic Club'];

const alphabetUpperCase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const alphabetLowerCase = alphabetUpperCase.map(a => a.toLowerCase());

function dataRangePointCallback(strings, dimensions, dataRange, randomizer = Math.random) {
  const dataRangeMultipler = dataRange[1] - dataRange[0];
  return x => x < dimensions ? strings.pop() : (randomizer() * dataRangeMultipler) + dataRange[0];
}

function stringsRowCallback(dimensions, sorted) {
  return (r) => {
    let strings = [];
    if (sorted) {
      strings = r.splice(0, dimensions);
      r.sort((a, b) => a - b);
    }

    return strings.concat(r);
  };
}

function sortTableAlphabetically(table) {
  const data = table;
  const defs = data.splice(0, 1);
  data.sort((a, b) => (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0);

  return defs.concat(data);
}

/**
 * Generate a random string
 *
 * @param  {Array} args     A set of arrays to randomly join data. Adds strings based on input order, starting with first parameter
 * @return {String}          String randomly generated from input
 */
function stringGenerator(joinChar, randomizer, ...args) {
  return args.map((a) => {
    const aryIndex = Math.round(randomizer() * (a.length - 1));
    return a[aryIndex];
  }).join(joinChar);
}

/**
 * Generate a random set of strings
 *
 * @param  {Numbers} count  Number of names to generate
 * @param  {Array} args     A set of arrays to randomly join data. Adds strings based on input order, starting with first parameter
 * @return {Array}          Array of randomly generated strings
 */
function stringsGenerator(count, joinChar, randomizer, ...args) {
  const names = [];
  for (let i = 0; i < count; i++) {
    let name = stringGenerator(joinChar, randomizer, ...args);
    let c = 5;
    while (names.indexOf(name) !== -1 && c > 0) {
      name = stringGenerator(joinChar, randomizer, ...args);
      c--;
    }

    names.push(name);
  }

  return names;
}

function stringssGenerator(dimz, rows, joinChar, randomizer, ...args) {
  const names = [];

  function randomName() {
    let name = stringGenerator(';', randomizer, ...args);
    let c = 5;
    while (names.indexOf(name.replace(/;/g, joinChar)) !== -1 && c > 0) {
      name = stringGenerator(';', randomizer, ...args);
      c--;
    }
    return name;
  }
  for (let i = 0; i < rows; i++) {
    let name;
    let splitNames = [];
    for (let d = 0; d < dimz; d++) {
      if (d === 0) {
        name = randomName();
        splitNames = name.split(';');
      } else if (splitNames[d - 1]) {
        name = splitNames[d - 1];
      } else {
        name = randomName();
      }
      names.push(name.replace(/;/g, joinChar));
    }
  }

  return names;
}

/**
 * Generate data set with random sport team names, for usage with generateDataFromArray
 *
 * @param  {Integer} dimensions The number of dimensions to be generated
 * @param  {Integer} measures   The number of measures
 * @param  {Integer} rows       The number of rows
 * @param  {Boolean} sorted     If the rows are supposed to be sorted or not
 * @return {Array}              2d Array
 */
function generateTeamNameData({
  dimensions = 1,
  measures = 1,
  rows = 5,
  sorted = true,
  sortAlphabetically = true,
  dataRange = [0, 1000],
  randomizer = Math.random,
}) {
  const names = stringssGenerator(dimensions, rows + 1, ' ', randomizer, ...[cities, teamNames, sportsAbbreviations]);

  const table = hypercubeGenerator.generateCustomData(dimensions,
    measures,
    rows,
    stringsRowCallback(dimensions, sorted),
    dataRangePointCallback(names, dimensions, dataRange, randomizer));

  return sortAlphabetically ? sortTableAlphabetically(table) : table;
}

/**
 * Generate data set with random strings as dimension values, for usage with generateDataFromArray
 *
 * @param  {Integer} dimensions The number of dimensions to be generated
 * @param  {Integer} measures   The number of measures
 * @param  {Integer} rows       The number of rows
 * @param  {Boolean} sorted     If the rows are supposed to be sorted or not
 * @return {Array}              2d Array
 */
function generateRandomStringData({
  dimensions = 1,
  measures = 1,
  rows = 5,
  chars = 3,
  joinChar = '',
  sortAlphabetically = true,
  sorted = true,
  dataRange = [0, 1000],
  upperCase = true,
}) {
  const mek = Array(chars).fill(undefined).map(() => upperCase ? alphabetUpperCase : alphabetLowerCase);
  const strings = stringsGenerator(dimensions * rows + 1, joinChar, ...mek);

  const table = hypercubeGenerator.generateCustomData(dimensions,
    measures,
    rows,
    stringsRowCallback(dimensions, sorted),
    dataRangePointCallback(strings, dimensions, dataRange));

  return sortAlphabetically ? sortTableAlphabetically(table) : table;
}

const stringSets = {
  cities,
  teamNames,
  sportsAbbreviations,
  alphabetUpperCase,
  alphabetLowerCase,
};

export {
  generateTeamNameData,
  generateRandomStringData,
  stringGenerator,
  stringsGenerator,
  stringSets,
};
