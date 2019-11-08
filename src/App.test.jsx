import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('./examples/index.js');
jest.mock('./components/editor-area/editor-area.jsx');
jest.mock('./core/generic/touch.js');

const location = {
  hash: '#',
  assign: jest.fn(),
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App location={location} />, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(location.assign).toBeCalledWith('#bar-chart');
});
