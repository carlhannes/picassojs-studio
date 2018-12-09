import React, { Component } from 'react';
import PropTypes from 'prop-types';

import picasso from 'picasso.js';
import runScript from 'run-script';

import './rendering-area.css';

let prevCode;
let prevDataScript;
let prevSettings;
let prevData;

class RenderingArea extends Component {
  constructor(...props) {
    super(...props);
    this.element = React.createRef();
    this.message = React.createRef();

    this.processPicasso = this.processPicasso.bind(this);
  }

  componentDidMount() {
    this.pic = runScript('return picasso.chart({ element })', { picasso, element: this.element.current });
    this.processPicasso();
  }

  componentWillUnmount() {
    this.pic.destroy();
    this.pic = undefined;
  }

  processPicasso() {
    if (!(this.pic)) {
      return;
    }

    const { code, data: dataScript } = this.props;
    let doRun = false;
    let data = prevData;
    let settings = prevSettings;

    if (code !== prevCode) {
      doRun = true;
      settings = runScript(code);
    }
    if (dataScript !== prevDataScript) {
      doRun = true;
      data = runScript(dataScript);
    }

    if (!doRun) {
      return;
    }

    const result = runScript('picasso.update({ data, settings })', {
      data, settings, picasso: this.pic,
    });

    if (this.message && this.message.current) {
      if (result && result.error) {
        this.message.current.innerHTML = `Error: ${result.error.name}`;
      } else if (data && data.error) {
        this.message.current.innerHTML = `Data error: ${data.error.name}`;
      } else {
        this.message.current.innerHTML = 'Sucess';
      }
    }

    prevCode = code;
    prevSettings = settings;
    prevDataScript = dataScript;
    prevData = data;
  }

  render() {
    this.processPicasso();

    return (
      <div className="rendering-wrapper">
        <div
          ref={this.element}
          className="rendering-area"
        />
        <div className="message-wrapper">
          <p ref={this.message}>Loading...</p>
        </div>
      </div>
    );
  }
}

RenderingArea.propTypes = {
  code: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default RenderingArea;
