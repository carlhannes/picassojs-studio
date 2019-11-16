const code = `

return {
  interactions: [{
    type: 'native',
    events: {
      mousemove(e) {
        const tooltip = this.chart.component('tooltip');
        tooltip.emit('show', e);
      },
      mouseleave(e) {
        const tooltip = this.chart.component('tooltip');
        tooltip.emit('hide');
      }
    }
  }],
  scales: {
    s: {
      data: {
        field: 'Sales'
      },
      expand: 0.2,
      invert: true
    },
    m: {
      data: {
        field: 'Margin'
      },
      expand: 0.2
    },
    col: {
      data: { extract: { field: 'Year' } },
      type: 'color'
    }
  },
  components: [{
    key: 'y-axis',
    type: 'axis',
    scale: 's',
    dock: 'left'
  }, {
    type: 'legend-cat',
    dock: 'right',
    scale: 'col'
  }, {
    key: 'x-axis',
    type: 'axis',
    scale: 'm',
    dock: 'bottom'
  }, {
    key: 'p',
    type: 'point',
    data: {
      extract: {
        field: 'Month',
        props: {
          y: { field: 'Sales' },
          x: { field: 'Margin' },
          group: { field: 'Year' }
        }
      }
    },
    settings: {
      x: { scale: 'm' },
      y: { scale: 's' },
      shape: 'circle',
      size: () => 2,
      strokeWidth: 2,
      stroke: '#fff',
      opacity: 0.8,
      fill: { scale: 'col', ref: 'group' }
    }
  },
  {
    key: 'tooltip',
    type: 'tooltip',
    settings: { 
      duration: 10000,
      extract: ({ node, resources }) => console.log(node) || node.data.value,
      placement: {
        type: 'pointer',
        dock: 'top',
        offset: 8,
        area: 'viewport'
      }
    },
  },
  ]
};
`;

const data = `
return [{
  type: 'matrix',
  data: [
    ['Year', 'Month', 'Sales', 'Margin'],
    ['2010', 'Jan', 1106, 7],
    ['2010', 'Feb', 5444, 53],
    ['2010', 'Mar', 147, 64],
    ['2010', 'Apr', 7499, 47],
    ['2010', 'May', 430, 62],
    ['2010', 'June', 9735, 13],
    ['2010', 'July', 7435, 15],
    ['2011', 'Jan', 1482, 45],
    ['2011', 'Feb', 2659, 76],
    ['2011', 'Mar', 1261, 73],
    ['2011', 'Apr', 3085, 56],
    ['2011', 'May', 3035, 91],
    ['2011', 'June', 7691, 88],
    ['2011', 'July', 3012, 81],
    ['2012', 'Jan', 7980, 61],
    ['2012', 'Feb', 2564, 22],
    ['2012', 'Mar', 7957, 98],
    ['2012', 'Apr', 5809, 1],
    ['2012', 'May', 429, 2],
    ['2012', 'June', 6757, 77],
    ['2012', 'July', 9415, 92]
  ]
}];
`;

const item = {
  id: 'simple-tooltip',
  title: 'Simple tooltip example',
  code,
  data,
};

export default item;
