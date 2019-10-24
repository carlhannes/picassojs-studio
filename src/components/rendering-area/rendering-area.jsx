/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import picasso from 'picasso.js';
import picQ from 'picasso-plugin-q';
import 'hammerjs';
import picHammer from 'picasso-plugin-hammer';

import enigma from 'enigma.js';
import enigmaSchema from 'enigma.js/schemas/12.20.0.json';

import runScript from 'run-script';

import './rendering-area.css';
import debounce from '../../core/generic/debounce';

import quickHypercube from '../../core/data/quick-hypercube';

// Use picasso plugins
picasso.use(picQ);
picasso.use(picHammer);

let prevCode;
let prevDataScript;
let prevSettings;
let prevData;

const logError = (...params) => {
  // eslint-disable-next-line no-console
  console.error(...params);
};

class RenderingArea extends Component {
  debouncedProcess = debounce((props) => {
    const {
      code, dataScript, message,
    } = props;

    let doRun = false;
    let data = prevData;
    let settings = prevSettings;

    if (code !== prevCode) {
      this.reboot();
      doRun = true;
      settings = runScript(code, {
        picasso: this.pic,
        enigma,
        enigmaSchema,
      });
    }
    if (dataScript !== prevDataScript) {
      doRun = true;
      data = runScript(dataScript, {
        picasso: this.pic,
        enigma,
        enigmaSchema,
        quickHypercube,
      });
    }

    if (!doRun) {
      return;
    }

    if (message && message.current) {
      if (settings && settings.error) {
        message.current.innerHTML = `Settings error: ${settings.error.name}`;
        logError(settings.error);
      } else if (data && data.error) {
        message.current.innerHTML = `Data error: ${data.error.name}`;
        logError(data.error);
      } else {
        const result = runScript('picasso.update({ data, settings })', {
          data, settings, picasso: this.pic,
        });

        if (result && result.error) {
          message.current.innerHTML = `Rendering error: ${result.error.name}`;
          logError(result.error);
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

  debouncedResize = debounce(() => {
    runScript('picasso.update()', {
      picasso: this.pic,
    });
  }, 50);

  constructor(...props) {
    super(...props);
    this.element = React.createRef();
    this.message = React.createRef();
  }


  componentDidMount() {
    this.reboot();
    this.processPicasso();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    this.pic.destroy();
    this.pic = undefined;
    window.removeEventListener('resize', this.resize);
  }

  reboot = () => {
    if (this.pic) {
      this.pic.destroy();
      this.pic = undefined;
    }
    this.pic = runScript('return picasso.chart({ element })', { picasso, element: this.element.current });
  }

  resize = () => {
    this.debouncedResize();
  }

  processPicasso = () => {
    if (!(this.pic)) {
      return;
    }

    const { code, data } = this.props;

    this.debouncedProcess({
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
          <p className="picasso-version">
            picasso.js v
            {picasso.version}
          </p>
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
