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
  },{
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
      slice: {
        arc: { ref: 'num' },
        fill: { scale: 'c' },
        outerRadius: () => 0.9,
        strokeWidth: 1,
        stroke: 'rgba(255, 255, 255, 0.5)'
      }
    }
  }]
};
`;

const data = `
var arr = [
  ['Year', 'Sales', 'Margin']
];

for (var i = 0; i < 5; i++) {
  arr.push([
    String(2010 + i),
    parseFloat((Math.random() * 1000).toFixed(0)),
    parseFloat((Math.random() * 100).toFixed(0))]);
}

return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'pie-chart',
  title: 'Pie chart',
  code,
  data,
};

export default item;
