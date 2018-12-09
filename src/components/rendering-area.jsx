import React, { Component } from 'react';
import PropTypes from 'prop-types';

import picasso from 'picasso.js';
import runScript from 'run-script';

class RenderingArea extends Component {
  constructor(...props) {
    super(...props);
    this.element = React.createRef();

    this.processPicasso = this.processPicasso.bind(this);
  }

  componentDidMount() {
    this.processPicasso();
  }

  processPicasso() {
    const { code, data: dataScript } = this.props;
    const { element } = this;

    const data = runScript(dataScript);
    const settings = runScript(code);

    const result = runScript('picasso.chart({ element, data, settings })', {
      element: element.current, data, settings, picasso,
    });

    console.log(element, result);
  }

  render() {
    this.processPicasso();

    return (
      <div
        ref={this.element}
        style={{
          position: 'relative', display: 'block', width: '100%', height: '100%',
        }}
      />
    );
  }
}

RenderingArea.propTypes = {
  code: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default RenderingArea;
