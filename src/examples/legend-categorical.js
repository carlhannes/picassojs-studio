const code = `
var settings = {
  interactions: [{
    type: 'native',
    events: {
      wheel: function w(e) {
        var legend = this.chart.component('cat');
        legend.emit('scroll', Math.max(-1, Math.min(1, -e.wheelDelta)));
      }
    }
  }, {
    type: 'hammer',
    gestures: [{
      type: 'Tap',
      options: {
        taps: 1
      },
      events: {
        tap: function tap(e) {
          var legend = this.chart.component('cat');
          legend.emit('tap', e, 3);
        }
      }
    }, {
      type: 'Pan',
      events: {
        pan: function pan(e) {
          var components = this.chart.componentsFromPoint(e.center);
          components.forEach(function (comp) {
            console.log(e.deltaY);
            comp.emit('scroll', Math.max(-1, Math.min(1, -(e.deltaY / 20))));
          });
        }
      }
    }, {
      type: 'Press',
      options: {},
      events: {
        press: function press(e) {
          var legend = this.chart.component('cat');
          intervalId = setInterval(function () {
            legend.emit('tap', e, 1);
          }, 50);
        },
        pressup: function pressup() {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }]
  }],
  scales: {
    x: {
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          value: function value(v) {
            return v;
          },
          props: {
            brush: {}
          }
        }
      },
      label: function label(v) {
        return v.datum.value.qText;
      },
      value: function value(v) {
        return v.datum.value.qElemNumber;
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
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          value: function value(v) {
            return v;
          },
          props: {
            brush: {}
          }
        }
      },
      label: function label(v) {
        return v.datum.value.qText;
      },
      value: function value(v) {
        return v.datum.value.qElemNumber;
      },
      type: 'color'
    }
  },
  components: [{
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
          return color(d.datum.value);
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
  }, {
    key: 'cat',
    type: 'legend-cat',
    scale: 'color',
    dock: 'right',
    settings: {
      item: {
        label: {
          wordBreak: 'break-word'
        },
        shape: {
          type: 'square',
          size: 8
        }
      },
      title: {
        text: 'My title',
        wordBreak: 'break-word'
      },
      buttons: {
        show: true
      }
    },
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
  }]
};

return settings;
`;

const data = `
return quickHypercube({
  dimensions: 1,
  measures: 5,
  rows: 65,
  dataRange: [0, 100],
  sorted: true,
  sortAlphabetically: true
});
`;

const item = {
  id: 'legend-cat',
  title: 'Legend - categorical',
  code,
  data,
};

export default item;
