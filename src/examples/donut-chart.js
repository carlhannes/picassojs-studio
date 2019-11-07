const code = `
return {
  scales: {
    c: {
      data: { extract: { field: 'Year' } }, type: 'color'
    }
  },
  components: [{
    type: 'legend-cat',
    scale: 'c'
  }, {
    key: 'p',
    type: 'pie',
    data: {
      extract: {
        field: 'Year',
        props: {
          num: { field: 'Sales' }
        }
      }
    },
    settings: {
      padAngle: 0.01,
      slice: {
        cornerRadius: 4,
        innerRadius: 0.4,
        arc: { ref: 'num' },
        fill: { scale: 'c' },
        strokeWidth: 1,
        stroke: 'rgba(255, 255, 255, 0.5)'
      }
    }
  }]
};
`;

const data = `
var arr = [
  ['Year', 'Sales', 'Budget']
];

for (var i = 0; i < 8; i++) {
  arr.push([
    String(2010 + i),
    parseFloat((Math.random() * 1000).toFixed(0)),
    parseFloat((Math.random() * 1000).toFixed(0))]);
}

return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'donut-chart',
  title: 'Donut chart',
  code,
  data,
};

export default item;
