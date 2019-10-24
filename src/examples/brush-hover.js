const code = `
var propModes = [[''], ['x'], ['y'], ['x', 'y'], ['name']];

var mode = propModes[3];

var settings = {
  scales: {
    d0: { data: { extract: { field: 'qDimensionInfo/0', value: function value(v) {
            return v;
          } } }, value: function value(v) {
        return v.datum.value.qElemNumber;
      }, label: function label(v) {
        return v.datum.value.qText;
      } },
    d1: { data: { extract: { field: 'qDimensionInfo/1', value: function value(v) {
            return v;
          } } }, value: function value(v) {
        return v.datum.value.qElemNumber;
      }, label: function label(v) {
        return v.datum.value.qText;
      } },
    d2: { data: { extract: { field: 'qDimensionInfo/2', value: function value(v) {
            return v;
          } } }, value: function value(v) {
        return v.datum.value.qElemNumber;
      }, label: function label(v) {
        return v.datum.value.qText;
      } }
  },
  components: [{
    type: 'axis',
    scale: 'd2',
    dock: 'left',
    settings: {
      ticks: {
        show: false
      },
      line: {
        show: false
      }
    }
  }, {
    type: 'axis',
    scale: 'd0',
    dock: 'bottom',
    settings: {
      ticks: {
        show: false
      },
      line: {
        show: false
      }
    }
  }, {
    type: 'point-marker',
    data: {
      extract: {
        field: 'qDimensionInfo/3',
        props: {
          color: { field: 'qMeasureInfo/0' },
          x: { field: 'qDimensionInfo/0' },
          y: { field: 'qDimensionInfo/2' },
          name: { field: 'qDimensionInfo/1' }
        }
      }
    },
    brush: {
      trigger: [{
        on: 'over',
        contexts: ['highlight'],
        data: mode
      }],
      consume: [{
        context: 'highlight',
        data: mode,
        style: {
          inactive: {
            opacity: 0.8,
            stroke: '#aaa',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      }]
    },
    settings: {
      x: {
        scale: 'd0',
        ref: 'x',
        fn: function fn(d) {
          return d.scale(d.datum.x.value) + d.scale.bandwidth() * 0.5 + 0.01 - Math.random() * 0.02;
        }
      },
      y: {
        scale: 'd2',
        ref: 'y',
        fn: function fn(d) {
          return d.scale(d.datum.y.value) + d.scale.bandwidth() * 0.5 + 0.005 - Math.random() * 0.01;
        }
      },
      size: 0.8,
      opacity: 0.95,
      stroke: 'rgba(255, 255, 255, 0.8)',
      strokeWidth: 1.0,
      fill: { ref: 'color', scale: { data: { field: 'qMeasureInfo/0' }, type: 'color' } }
    }
  }]
};

return settings;
`;

const data = `
var teamData = quickHypercube.customGenerator.generateTeamNameData({
  dimensions: 4,
  measures: 3,
  rows: 150,
  dataRange: [10, 100],
  sorted: false,
  sortAlphabetically: false,
  uniqueCities: 20,
  uniqueTeamNames: 5,
  uniqueAbbr: 10
});

var qLayout = quickHypercube.hypercubeGenerator.generateDataFromArray(teamData);

var data = [{
  type: 'q',
  key: 'qHyperCube',
  data: qLayout.qHyperCube
}];

return data;
`;

const item = {
  id: 'brush-hover',
  title: 'Brushing - hover',
  code,
  data,
};

export default item;
