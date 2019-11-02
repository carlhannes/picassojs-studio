const code = `
var settings = {
  scales: {
    x: {
      data: { extract: { field: 'qMeasureInfo/0' } },
      expand: [0.1]
    },
    y: {
      data: { extract: { field: 'qMeasureInfo/1' } },
      invert: true
    }
  },
  components: [{
    scale: 'y',
    type: 'axis',
    dock: 'left'
  }, {
    key: 'xaxis',
    type: 'axis',
    scale: 'x',
    dock: 'bottom'
  }, {
    type: 'point-marker',
    data: {
      extract: {
        field: 'qDimensionInfo/3',
        props: {
          color: { field: 'qMeasureInfo/0' },
          dim: { field: 'qDimensionInfo/2', reduce: 'first', type: 'qual' },
          x: { field: 'qMeasureInfo/0' },
          y: { field: 'qMeasureInfo/1' },
          size: { field: 'qMeasureInfo/2' }
        }
      }
    },
    settings: {
      x: { scale: 'x' },
      y: { scale: 'y' },
      sizeLimits: {
        maxRel: 0.1,
        minRel: 0.001
      },
      opacity: 0.9,
      size: { scale: { source: 'qMeasureInfo/2' } },
      fill: { ref: 'color', scale: { source: 'qMeasureInfo/0', type: 'color' } }
    }
  }, {
    type: 'ref-line',
    style: {
      oob: {
        fontFamily: 'Arial'
      }
    },
    lines: {
      x: [{
        value: 0.2,
        line: {
          stroke: 'green',
          strokeWidth: 2
        },
        label: {
          text: 'النص العربي',
          padding: 10,
          fontSize: '20px',
          vAlign: 0.75,
          align: 'left'
        }
      }],
      y: [{
        value: 75,
        scale: 'y',
        line: {
          stroke: 'red'
        },
        label: {
          text: 'woqwedasdasdasdasdasdasdasdasdw',
          fontSize: '14px',
          vAlign: 0,
          align: 0
        }
      }, {
        value: 45,
        scale: 'y',
        line: {
          stroke: 'red'
        },
        label: {
          padding: 5,
          text: 'ÅgoasdokasdkoÅgoasdokasdko',
          fontSize: '14px',
          align: 'right',
          vAlign: 'bottom'
        }
      }]
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
  sortAlphabetically: false
});
`;

const item = {
  id: 'reference-lines',
  title: 'Reference lines',
  code,
  data,
};

export default item;
