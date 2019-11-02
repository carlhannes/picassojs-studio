const code = `
var color = null;
var colorInfo = data[0].data.qMeasureInfo[0];

var settings = {
  scales: {
    x: {
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          props: {
            brush: {}
          }
        }
      },
      padding: 0.2
    },
    y: {
      data: { fields: ['qMeasureInfo/0'] },
      invert: true,
      min: 0,
      expand: 0.05
    },
    color: {
      data: { field: 'qMeasureInfo/0' },
      type: 'threshold-color',
      domain: [colorInfo.qMin, colorInfo.qMax * 0.33, colorInfo.qMax * 0.66],
      range: ['', '#ffeda0', '#feb24c', '#f03b20']
    }
  },
  components: [{
    type: 'legend-cat',
    scale: 'color',
    dock: 'right',
    settings: {
      title: {
        text: 'ALL YOUR BASES BELONG TO US',
        maxLines: 2,
        wordBreak: 'break-word'
      }
    }
  }, {
    type: 'axis',
    scale: 'y'
  }, {
    type: 'axis',
    scale: 'x',
    brush: {
      trigger: [{
        on: 'tap',
        action: 'toggle',
        data: ['brush'],
        contexts: ['highlight']
      }],
      consume: [{
        context: 'highlight',
        style: {
          inactive: {
            opacity: 0.4
          }
        }
      }]
    }
  }, {
    type: 'box-marker',
    require: ['chart'],
    created: function created() {
      color = this.chart.scale('color');
    },
    brush: {
      trigger: [{
        on: 'tap',
        action: 'toggle',
        contexts: ['highlight']
      }],
      consume: [{
        context: 'highlight',
        style: {
          inactive: {
            opacity: 0.2
          }
        }
      }]
    },
    data: {
      extract: {
        field: 'qDimensionInfo/0',
        props: {
          start: { field: 'qMeasureInfo/0', value: 0 },
          end: { field: 'qMeasureInfo/0', reduce: 'max' }
        }
      }
    },
    settings: {
      major: {
        scale: 'x'
      },
      minor: {
        scale: 'y'
      },
      whisker: {
        stroke: 'gray',
        strokeWidth: 2
      },
      box: {
        fill: function fill(d) {
          return color(d.datum.end.value);
        },
        stroke: 'gray',
        maxWidthPx: 9999
      },
      median: {
        strokeWidth: 1,
        stroke: 'gray'
      },
      vertical: true
    }
  }]
};

return settings;
`;

const data = `
return quickHypercube({
  dimensions: 1,
  measures: 5,
  rows: 25,
  dataRange: [0, 100],
  sorted: true,
  sortAlphabetically: true
});
`;

const item = {
  id: 'legend-thres',
  title: 'Legend - threshold',
  code,
  data,
};

export default item;
