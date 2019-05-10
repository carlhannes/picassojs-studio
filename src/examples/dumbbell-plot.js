const code = `
return {
  collections: [{
    key: 'd',
    data: {
      extract: {
        field: 'Dim',
        props: {
          start: { field: 'Low' },
          end: { field: 'High' },
        },
      },
    },
  }],
  scales: {
    y: {
      data: { extract: { field: 'Dim' } },
    },
    v: {
      data: { fields: ['Low', 'High'] },
      expand: 0.1,
    },
  },
  components: [{
    type: 'grid-line',
    y: 'y',
  }, {
    type: 'axis',
    dock: 'left',
    scale: 'y',
  }, {
    type: 'axis',
    dock: 'bottom',
    scale: 'v',
  }, {
    key: 'bars',
    type: 'box',
    data: {
      collection: 'd',
    },
    settings: {
      orientation: 'horizontal',
      major: { scale: 'y' },
      minor: { scale: 'v' },
      box: {
        width: 0.1,
        fill: '#ccc',
      },
    },
  }, {
    type: 'point',
    data: {
      collection: 'd',
    },
    settings: {
      x: { scale: 'v', ref: 'start' },
      y: { scale: 'y' },
      fill: '#fa0',
      size: 0.8,
    },
  }, {
    type: 'point',
    data: {
      collection: 'd',
    },
    settings: {
      x: { scale: 'v', ref: 'end' },
      y: { scale: 'y' },
      fill: '#bdf700',
      size: 0.8,
    },
  }],
};
`;

const data = `
var arr = [
  ['Dim', 'Low', 'High']
];

var low = 50;
var high;
for (var m = 0; m < 24; m++) {
  low = low + Math.random();
  high = low + 1 + Math.random() * 5;
  arr.push([
    String.fromCharCode(65 + m),
    low,
    high
  ]);
}
return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'dumbbell-plot',
  title: 'Dumbbell plot',
  code,
  data,
};

export default item;
