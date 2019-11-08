const code = `
const box = function({
  id,
  start,
  end,
  width,
  fill,
  minHeightPx
}) {
  const b = {
    key: id,
    type: 'box',
    data: {
      extract: {
        field: 'Dim',
        props: {
          start,
          end
        }
      }
    },
    settings: {
      orientation: 'horizontal',
      major: { scale: 'y' },
      minor: { scale: 'v' },
      box: {
        width,
        fill,
        minHeightPx
      }
    }
  };
  
  return b;
};

const labels = function({
  c,
  justify = 0,
  align = 0.5,
  position = 'inside',
  fontSize = 16,
  fill = '#111'
}) {
  return {
    type: 'labels',
    displayOrder: 2,
    settings: {
      sources: [{
        component: c,
        selector: 'rect',
        strategy: {
          type: 'bar',
          settings: {
            direction: 'right',
            fontSize,
            align,
            labels: [{
              placements: [{
                position,
                fill,
                justify
              }],
              label: function label(d) {
                return (d.data.end.label).toFixed(2);
              }
            }]
          }
        }
      }]
    }
  };
};

return {
  collections: [{
    key: 'd',
      data: {
        extract: {
          field: 'Dim',
          props: {
            start: { field: 'Measure' },
            end: { field: 'Target' }
          }
        }
      }
  }],
  scales: {
    y: {
      data: { extract: { field: 'Dim' } },
      padding: 0.1
    },
    v: {
      data: { fields: ['Measure', 'Target'] },
      expand: 0.1,
      min: 0,
    }
  },
  components: [{
    type: 'axis',
    dock: 'left',
    scale: 'y'
  },{
    type: 'axis',
    dock: 'bottom',
    scale: 'v'
  },
    box({ id: 'bars', start: 0, end: { field: 'Measure' }, width: 0.5, fill: '#fa0' }),
    box({ id: 'target', start: { field: 'Target' }, end: { field: 'Target' }, width: 1.0, fill: '#111', minHeightPx: 3 }),
    labels({c: 'bars'}),
    labels({c: 'target', position: 'opposite', align: 0, fontSize: 12, fill: '#666'})
]
};
`;

const data = `
const arr = [
  ['Dim', 'Measure', 'Target']
];

for (let i = 0; i < 4; i++) {
  let m = 50 + Math.random() * 40;
  let target = m + -10 + Math.random() * 20;
  arr.push([
    String.fromCharCode(65 + i),
    m,
    target
  ]);
}
return [{
  type: 'matrix',
  data: arr
}];
`;

const item = {
  id: 'labeling-bars',
  title: 'Labeling bars',
  code,
  data,
};

export default item;
