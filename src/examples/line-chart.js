const code = `
return {
  scales: {
    y: {
      data: { field: 'Sales' },
      invert: true,
      expand: 0.2
    },
    t: { data: { extract: { field: 'Year' } } }
  },
  components: [{
    type: 'axis',
    dock: 'left',
    scale: 'y',
    formatter: {
      type: 'd3-number',
      format: '$,.1r'
    },
  },{
    type: 'axis',
    dock: 'bottom',
    scale: 't',
    formatter: {
      type: 'd3-time',
      format: '%Y-%m'
    }
  }, {
    key: 'lines',
    type: 'line',
    data: {
      extract: {
        field: 'Year',
        props: {
          v: { field: 'Sales' }
        }
      }
    },
    settings: {
      coordinates: {
        major: { scale: 't' },
        minor: { scale: 'y', ref: 'v' }
      },
      layers: {
        line: {}
      }
    }
  }]
};
`;

const data = `
var arr = [
  ['Year', 'Sales']
];
let s = 0.5;
for (var i = 0; i < 500; i++) {
  s = s - 2 + 4 * Math.random();
  arr.push([
    new Date(2017, 0, i).valueOf(),
    10000 + s * 10000,
  ]);
}

return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'line-chart',
  title: 'Line chart',
  code,
  data,
};

export default item;
