const code = `
return {
  collections: [{
    key: 'stacked',
    data: {
      extract: {
        field: 'Month',
        props: {
          line: { field: 'Year' },
          end: { field: 'Sales' }
        }
      },
      stack: {
        stackKey: d => d.value,
          value: d => d.end.value,
          offset: 'silhouette',
          order: 'insideout'
      }
    }
  }],
  scales: {
    y: {
      data: {
        collection: {
          key: 'stacked'
        }
      },
      invert: true,
      expand: 0.2,
    },
    t: { data: { extract: { field: 'Month' } } },
    color: { data: { extract: { field: 'Year' } }, type: 'color' }
  },
  components: [{
    type: 'axis',
    dock: 'bottom',
    scale: 't'
  }, {
    key: 'lines',
    type: 'line',
    data: {
      collection: 'stacked'
    },
    settings: {
      coordinates: {
        major: { scale: 't' },
        minor0: { scale: 'y', ref: 'start' },
        minor: { scale: 'y', ref: 'end' },
        layerId: { ref: 'line' }
      },
      layers: {
        curve: 'monotone',
        line: {
          show: false
        },
        area: {
          fill: { scale: 'color', ref: 'line' }
        }
      }
    }
  }]
};
`;

const data = `
var arr = [
  ['Year', 'Month', 'Sales']
];

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
for (var i = 0; i < 6; i++) {
  for (var m = 0; m < months.length; m++) {
    arr.push([
      String(2010 + i),
      months[m],
      parseFloat((Math.random() * 10000).toFixed(0)),
      parseFloat((Math.random() * 100).toFixed(0))]);
  }
}
return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'stream-graph',
  title: 'Stream graph',
  code,
  data,
};

export default item;
