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
let prevItem = '';

function setStatusOK({
  node, message, details,
}) {
  const { current } = node;

  if (!current) {
    return;
  }

  current.innerHTML = `<h1>${message}</h1> <p>${details || 'No details available'}</p>`;
  current.className = '';
}

function setStatusError({
  node, message, stack,
}) {
  const { current } = node;

  if (!current) {
    return;
  }

  let msg = `<h1>${message}</h1>`;

  if (stack) {
    msg += `<code class="stack">${stack.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
  }

  if (!window.preventError) {
    current.innerHTML = msg;
    current.className = 'error';
  }
}

const logError = (...params) => {
  // eslint-disable-next-line no-console
  console.error(...params);
};

class RenderingArea extends Component {
  debouncedProcess = debounce((props) => {
    const {
      selectedMenuItem, code, dataScript, message,
    } = props;

    let doRun = false;
    let data = prevData;
    let settings = prevSettings;

    if (code !== prevCode) {
      if (selectedMenuItem !== prevItem) {
        this.reboot();
        prevItem = selectedMenuItem;
      }
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
        setStatusError({ node: message, message: `Settings error: ${settings.error.message}`, stack: settings.error.stack });
        logError(settings.error);
      } else if (data && data.error) {
        setStatusError({ node: message, message: `Data error: ${data.error.message}`, stack: data.error.stack });
        logError(data.error);
      } else {
        const result = runScript('picasso.update({ data, settings })', {
          data, settings, picasso: this.pic,
        });

        if (result && result.error) {
          setStatusError({ node: message, message: `Rendering error: ${result.error.message}`, stack: result.error.stack });
          logError(result.error);
        } else {
          setStatusOK({ node: message, message: 'Success <small>(hover to see details on error)</small>' });
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

    const { code, data, selectedMenuItem } = this.props;

    this.debouncedProcess({
      code, dataScript: data, pic: this.pic, message: this.message, selectedMenuItem,
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
          <div className="message-container">
            <p ref={this.message}>Loading...</p>
          </div>
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
  selectedMenuItem: PropTypes.string.isRequired,
};

export default RenderingArea;
