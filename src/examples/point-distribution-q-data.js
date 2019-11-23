const code = `
return {
  scales: {
    y: {
      data: {
        extract: { field: 'qDimensionInfo/0' }
      }
    },
    m: {
      data: {
        field: 'qMeasureInfo/0'
      },
      expand: 0.1
    },
    s: {
      data: {
        field: 'qMeasureInfo/1'
      }
    },
    col: {
      data: { extract: { field: 0 } },
      type: 'color'
    }
  },
  components: [
    {
      key: 'y-axis',
      type: 'axis',
      scale: 'y',
      dock: 'left'
    },
    {
      key: 'x-axis',
      type: 'axis',
      scale: 'm',
      dock: 'bottom'
    },
    {
      type: 'grid-line',
      y: 'y'
    },
    {
      key: 'p',
      type: 'point',
      data: {
        extract: {
          field: 'qDimensionInfo/1',
          props: {
            size: { field: 'qMeasureInfo/1' },
            x: { field: 'qMeasureInfo/0' },
            group: { field: 'qDimensionInfo/0' }
          }
        }
      },
      settings: {
        x: { scale: 'm' },
        y: { scale: 'y', ref: 'group' },
        shape: 'circle',
        size: { scale: 's' },
        strokeWidth: 2,
        stroke: '#fff',
        opacity: 0.8,
        fill: { scale: 'col', ref: 'group' }
      }
    }
  ]
};
`;

const data = `
// https://www.npmjs.com/package/qix-faker
const hc = qixFaker.hypercube({
  numRows: 100,
  dimensions: [
    {
      value: f => f.commerce.department(),
      maxCardinalRatio: 0.1
    },
    f => f.commerce.product()
  ],
  measures: [f => f.commerce.price(), f => f.commerce.price()]
});
return [
  {
    type: 'q',
    data: hc
  }
];
`;

const item = {
  id: 'point-distribution-qix-faker',
  title: 'Point distribution (QIX Faker)',
  code,
  data,
};

export default item;
