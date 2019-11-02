const code = `
var settings = {
  interactions: [{
    type: 'hammer',
    gestures: [{
      type: 'Pan',
      options: {
        direction: Hammer.DIRECTION_VERTICAL,
        event: 'legendRange'
      },
      events: {
        legendRangestart: function legendRangestart(e) {
          this.chart.component('legendRangeBrush').emit('rangeStart', e);
        },
        legendRangemove: function legendRangemove(e) {
          this.chart.component('legendRangeBrush').emit('rangeMove', e);
        },
        legendRangeend: function legendRangeend(e) {
          this.chart.component('legendRangeBrush').emit('rangeEnd', e);
        }
      }
    }]
  }],
  scales: {
    x: {
      data: { key: 'qHyperCube', field: 'qMeasureInfo/0' },
      expand: 0.1
    },
    y: {
      data: { key: 'qHyperCube', field: 'qMeasureInfo/1' },
      expand: 0.1,
      invert: true
    },
    color: {
      data: { key: 'qHyperCube', field: 'qMeasureInfo/2' },
      type: 'sequential-color'
    },
    colorRange: {
      data: { key: 'qHyperCube', field: 'qMeasureInfo/2' },
      invert: true
    }
  },
  components: [{
    displayOrder: 10,
    type: 'legend-seq',
    key: 'legend',
    dock: 'right',
    settings: {
      fill: 'color',
      major: 'colorRange',
      title: {
        text: 'ALL YOUR BASES BELONG TO US',
        maxLines: 2,
        wordBreak: 'break-word'
      }
    }
  }, {
    type: 'brush-range',
    key: 'legendRangeBrush',
    dock: '@legend',
    settings: {
      brush: 'highlight',
      scale: 'colorRange',
      direction: 'vertical',
      bubbles: {
        align: 'start',
        placement: 'outside'
      },
      target: {
        selector: '[id="legend-seq-target"]', // legend-seq-target
        fillSelector: '[id="legend-seq-ticks"]', // Optional
        fill: 'rgba(82,204,82,0.2)'
      }
    }
  }, {
    key: 'y-axis',
    scale: 'y',
    type: 'axis'
  }, {
    key: 'x-axis',
    type: 'axis',
    scale: 'x',
    dock: 'bottom'
  }, {
    type: 'grid-line',
    x: { scale: 'x' },
    y: { scale: 'y' }
  }, {
    key: 'pm',
    type: 'point-marker',
    data: {
      extract: {
        field: 'qDimensionInfo/0',
        props: {
          x: { field: 'qMeasureInfo/0' },
          y: { field: 'qMeasureInfo/1' },
          color: { field: 'qMeasureInfo/2' }
        }
      }
    },
    settings: {
      size: 0.5,
      x: { scale: 'x', ref: 'x' },
      y: { scale: 'y', ref: 'y' },
      fill: { ref: 'color', scale: 'color' }
    },
    brush: {
      consume: [{
        context: 'highlight',
        style: {
          inactive: {
            opacity: 0.2
          }
        }
      }]
    }
  }]
};

return settings;
`;

const data = `
return quickHypercube({
  dimensions: 2,
  measures: 4,
  rows: 100,
  dataRange: [0, 1000],
  sorted: false,
  sortAlphabetically: false,
  chars: 5,
  joinChar: '',
  upperCase: false
});
`;

const item = {
  id: 'legend-seq',
  title: 'Legend - sequential',
  code,
  data,
};

export default item;
