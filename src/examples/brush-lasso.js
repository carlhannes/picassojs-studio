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
      events: {
        panstart: function onPanStart(e) {
          this.chart.component('lasso').emit('lassoStart', e);
        },
        pan: function onPan(e) {
          this.chart.component('lasso').emit('lassoMove', e);
        },
        panend: function onPanEnd(e) {
          this.chart.component('lasso').emit('lassoEnd', e);
        }
      }
    }]
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
    key: 'pm',
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
  }, {
    key: 'lasso',
    type: 'brush-lasso',
    settings: {
      brush: {
        components: [{
          key: 'pm',
          contexts: ['highlight'],
          action: 'add'
        }]
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
  id: 'brush-lasso',
  title: 'Brushing - lasso',
  code,
  data,
};

export default item;
