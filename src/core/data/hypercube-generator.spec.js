/* eslint-disable max-len */
import generator from './hypercube-generator';

describe('Hypercube generator', () => {
  it('should support generating multiple measures', () => {
    const d = generator.generateDataFromArray([
      ['d', 'm', 'm', 'm'], // field type
      ['Year', 'Sales', 'Cost', 'Margin'], // label
      ['2008', 1, 2, 3],
      ['2009', 2, 1, 3],
      ['2010', 1, 2, -1],
    ]);

    const m = d.qHyperCube.qDataPages[0].qMatrix;

    expect(d.qHyperCube.qSize.qcx).toEqual(4);
    expect(d.qHyperCube.qSize.qcy).toEqual(3);

    expect(d.qHyperCube.qDimensionInfo.length).toEqual(1);
    expect(d.qHyperCube.qMeasureInfo.length).toEqual(3);

    expect(d.qHyperCube.qMeasureInfo[0].qMax).toEqual(2);
    expect(d.qHyperCube.qMeasureInfo[2].qMin).toEqual(-1);

    expect(m[0][0].qText).toEqual('2008');
    expect(m[2][3].qNum).toEqual(-1);
  });

  it('should support generating multiple dimensions', () => {
    const d = generator.generateDataFromArray([
      ['d', 'd', 'm', 'm', 'm'], // field type
      ['Year', 'Quarter', 'Sales', 'Cost', 'Margin'], // label
      ['2008', 'Q1', 1, 2, -1],
      ['2008', 'Q2', 2, 3, -2],
      ['2008', 'Q3', 3, 4, -3],
      ['2008', 'Q4', 1, 2, -4],
      ['2009', 'Q1', 2, 1, 2],
      ['2009', 'Q2', 0, 1, 0],
      ['2009', 'Q3', 2, 1, 0],
      ['2009', 'Q4', 5, 1, 3],
    ]);

    expect(d.qHyperCube.qDimensionInfo.length).toEqual(2);
    expect(d.qHyperCube.qDimensionInfo[0].qFallbackTitle).toEqual('Year');
    expect(d.qHyperCube.qDimensionInfo[0].qApprMaxGlyphCount).toEqual(4);
    expect(d.qHyperCube.qDimensionInfo[0].qCardinal).toEqual(2);

    expect(d.qHyperCube.qDimensionInfo[1].qFallbackTitle).toEqual('Quarter');
    expect(d.qHyperCube.qDimensionInfo[1].qApprMaxGlyphCount).toEqual(2);
    expect(d.qHyperCube.qDimensionInfo[1].qCardinal).toEqual(4);

    expect(d.qHyperCube.qMeasureInfo.length).toEqual(3);
    expect(d.qHyperCube.qMeasureInfo[0].qMax).toEqual(5);
    expect(d.qHyperCube.qMeasureInfo[2].qMin).toEqual(-4);
  });

  it('should create random 2d arrays with the correct width and height', () => {
    const randomArr = generator.random2dArr(2, 2, null, () => Math.random());

    expect(randomArr.length).toEqual(2);
    expect(randomArr[0].length).toEqual(2);
  });

  it('should generate random data correctly', () => {
    const generatedData = generator.generateRandomData(1, 3, 5);

    expect(generatedData.length).toEqual(7); // 5 rows + 1 column row + 1 dimension/measure definition row
    expect(generatedData[0].length).toEqual(4); // 1 dimension, 3 measures = 4 columns

    expect(generatedData[0][0]).toEqual('d');
    expect(generatedData[0][1]).toEqual('m');
    expect(typeof generatedData[1][0]).toBe('number');
  });

  it('should generate random data correctly', () => {
    const generatedData = generator.generateCustomData(1, 3, 5, row => row, () => Math.random());

    expect(generatedData.length).toEqual(7); // 5 rows + 1 column row + 1 dimension/measure definition row
    expect(generatedData[0].length).toEqual(4); // 1 dimension, 3 measures = 4 columns

    expect(generatedData[0][0]).toEqual('d');
    expect(generatedData[0][1]).toEqual('m');
    expect(typeof generatedData[1][0]).toBe('number');
  });
});
