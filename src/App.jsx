import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import MonacoEditor from 'react-monaco-editor';
import { Menu, Icon } from 'antd';

import list from './examples';
import localList from './core/local-repo';

import RenderingArea from './components/rendering-area/rendering-area';

class App extends Component {
  constructor(...props) {
    super(...props);

    const { location } = this.props;

    this.onEditorChange = this.onEditorChange.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
    this.selectItem = this.selectItem.bind(this);

    this.state = {
      selectedMenuItem: location.hash.replace('#', '') || list[0].id,
    };

    const { selectedMenuItem } = this.state;

    this.state.selectedObject = {
      id: selectedMenuItem,
      title: selectedMenuItem,
      code: '',
      data: '',
    };
  }

  componentDidMount() {
    const { selectedMenuItem } = this.state;

    this.selectItem(selectedMenuItem);
  }

  onEditorChange(code) {
    const { selectedMenuItem, selectedObject } = this.state;

    if (selectedMenuItem.indexOf('@local/') === 0) {
      localList.update({ id: selectedMenuItem.replace('@local/', ''), code });
      this.setState({
        selectedObject: {
          ...selectedObject,
          code,
        },
      });
    } else {
      const result = localList.fork(selectedObject);
      if (result && result.id) {
        this.selectItem(`@local/${result.id}`);
      }
    }
  }

  onMenuClick(item) {
    this.selectItem(item.key);
  }

  selectItem(id) {
    const { location } = this.props;
    location.assign(`#${id}`);

    const selectedMenuItem = id;
    let selectedObject;

    if (selectedMenuItem.indexOf('@local/') === 0) {
      selectedObject = localList.get(selectedMenuItem.replace('@local/', ''));
    } else {
      selectedObject = list.reduce((o, c) => (c.id === selectedMenuItem ? c : o));
    }

    this.setState({ selectedMenuItem, selectedObject });
  }

  render() {
    const { selectedMenuItem, selectedObject } = this.state;

    return (
      <div className="app">
        <div className="module half scroll">
          <Menu
            theme="dark"
            mode="inline"
            onClick={this.onMenuClick}
            defaultOpenKeys={['defaults', 'custom']}
            selectedKeys={[selectedMenuItem]}
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
              {localList.list().map(item => <Menu.Item key={`@local/${item.id}`}>{item.title}</Menu.Item>)}
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
            value={selectedObject.code}
            onChange={this.onEditorChange}
          />
        </div>
        <div className="module">
          <RenderingArea code={selectedObject.code} data={selectedObject.data} />
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
