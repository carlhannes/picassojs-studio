import React, { Component } from 'react';
import PropTypes from 'prop-types';

import picasso from 'picasso.js';
import runScript from 'run-script';

import './rendering-area.css';

import debounce from '../../core/generic/debounce';

let prevCode;
let prevDataScript;
let prevSettings;
let prevData;

const debouncedProcess = debounce((props) => {
  const {
    code, dataScript, pic, message,
  } = props;

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

  if (message && message.current) {
    if (settings && settings.error) {
      message.current.innerHTML = `Settings error: ${settings.error.name}`;
    } else if (data && data.error) {
      message.current.innerHTML = `Data error: ${data.error.name}`;
    } else {
      const result = runScript('picasso.update({ data, settings })', {
        data, settings, picasso: pic,
      });

      if (result && result.error) {
        message.current.innerHTML = `Rendering error: ${result.error.name}`;
      } else {
        message.current.innerHTML = 'Success';
      }
    }
  }

  prevCode = code;
  prevSettings = settings;
  prevDataScript = dataScript;
  prevData = data;
}, 200);

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

    const { code, data } = this.props;

    debouncedProcess({
      code, dataScript: data, pic: this.pic, message: this.message,
    });
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
