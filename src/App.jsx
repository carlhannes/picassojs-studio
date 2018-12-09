import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import MonacoEditor from 'react-monaco-editor';
import { Menu, Icon } from 'antd';

import list from './examples';
import RenderingArea from './components/rendering-area';

class App extends Component {
  constructor(...props) {
    super(...props);

    const { location } = this.props;

    this.onEditorChange = this.onEditorChange.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);

    this.state = {
      selectedMenuItem: location.hash.replace('#', '') || list[0].id,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const { selectedMenuItem } = this.state;

    if (location.hash.replace('#', '') !== selectedMenuItem) {
      location.assign(`#${list[0].id}`);
    }
  }

  onEditorChange() {
    this.setState();
  }

  onMenuClick(item) {
    const { location } = this.props;
    location.assign(`#${item.key}`);
    this.setState({ selectedMenuItem: item.key });
  }

  render() {
    const { selectedMenuItem } = this.state;

    const { code, data } = list.reduce((o, c) => (c.id === selectedMenuItem ? c : o));

    return (
      <div className="app">
        <div className="module half scroll">
          <Menu
            theme="dark"
            mode="inline"
            onClick={this.onMenuClick}
            defaultOpenKeys={['defaults', 'custom']}
            defaultSelectedKeys={[selectedMenuItem]}
          >
            <Menu.SubMenu
              key="defaults"
              title={(
                <span>
                  <Icon type="home" />
                  <span>Default examples</span>
                </span>
                )}
            >
              {list.map(item => <Menu.Item key={item.id}>{item.title}</Menu.Item>)}
            </Menu.SubMenu>
            <Menu.SubMenu
              key="custom"
              title={(
                <span>
                  <Icon type="snippets" />
                  <span>Custom examples</span>
                </span>
                )}
            >
              <Menu.Item key="todo">TODO</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
        <div className="module">
          <MonacoEditor
            width="100%"
            height="100%"
            language="javascript"
            theme="vs-dark"
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
            }}
            value={code}
            onChange={this.onEditorChange}
          />
        </div>
        <div className="module">
          <RenderingArea code={code} data={data} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    assign: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
