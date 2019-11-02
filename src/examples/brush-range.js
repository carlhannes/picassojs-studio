const code = `
var settings = {
  scales: {
    x: {
      data: {
        field: 'qMeasureInfo/0'
      },
      expand: 0.05
    },
    y: {
      data: {
        field: 'qMeasureInfo/1'
      },
      invert: true,
      expand: 0.05
    }
  },
  interactions: [{
    type: 'hammer',
    gestures: [{
      type: 'Pan',
      options: {
        event: 'range'
      },
      events: {
        rangestart: function start(e) {
          if (e.direction === 2 || e.direction === 4) {
            rangeRef = 'rangeX';
          } else {
            rangeRef = 'rangeY';
          }

          this.chart.component(rangeRef).emit('rangeStart', e);
        },
        rangemove: function move(e) {
          this.chart.component(rangeRef).emit('rangeMove', e);
        },
        rangeend: function end(e) {
          this.chart.component(rangeRef).emit('rangeEnd', e);
        }
      }
    }
    ]
  }],
  components: [{
    scale: 'y',
    type: 'axis',
    dock: 'left',
    key: 'y-axis'
  }, {
    type: 'axis',
    scale: 'x',
    dock: 'bottom',
    key: 'x-axis'
  }, {
    type: 'point-marker',
    data: {
      extract: {
        field: 'qDimensionInfo/3',
        props: {
          color: { field: 'qMeasureInfo/0' },
          dim: {
            field: 'qDimensionInfo/2',
            value: function value(v) {
              return v.qText;
            }
          },
          x: { field: 'qMeasureInfo/0' },
          y: { field: 'qMeasureInfo/1' },
          size: { field: 'qMeasureInfo/2' }
        }
      }
    },
    brush: {
      consume: [{
        context: 'highlight',
        style: {
          inactive: {
            opacity: 0.3
          },
          active: {
            stroke: '#fff',
            strokeWidth: 2
          }
        }
      }]
    },
    settings: {
      x: { scale: 'x' },
      y: { scale: 'y' },
      opacity: 0.9,
      size: { scale: { data: { field: 'qMeasureInfo/2' } } },
      fill: { ref: 'color', scale: { data: { field: 'qMeasureInfo/0' }, type: 'color' } }
    }
  },
  {
    type: 'brush-range',
    key: 'rangeY',
    settings: {
      brush: 'highlight',
      direction: 'vertical',
      scale: 'y',
      target: {
        component: 'y-axis'
      },
      bubbles: {
        align: 'end'
      }
    }
  },
  {
    type: 'brush-range',
    key: 'rangeX',
    settings: {
      brush: 'highlight',
      direction: 'horizontal',
      scale: 'x',
      target: {
        component: 'x-axis'
      },
      bubbles: {
        align: 'start'
      }
    }
  }]
};

return settings;
`;

const data = `
return quickHypercube({
  dimensions: 4,
  measures: 3,
  rows: 200,
  dataRange: [10, 100],
  sorted: false,
  sortAlphabetically: false,
  uniqueCities: 20
});
`;

const item = {
  id: 'brush-range',
  title: 'Brushing - range',
  code,
  data,
};

export default item;
