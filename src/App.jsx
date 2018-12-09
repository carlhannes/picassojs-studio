import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import { Menu, Icon } from 'antd';

import list from './examples';
import localList from './core/local-repo';
import prompt from './core/prompt';

import RenderingArea from './components/rendering-area/rendering-area';
import EditorArea from './components/editor-area/editor-area';

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

  onEditorChange({ code: inputCode, data: inputData }) {
    const { selectedMenuItem, selectedObject } = this.state;
    const { code, data } = {
      code: inputCode || selectedObject.code,
      data: inputData || selectedObject.data,
    };

    if (selectedMenuItem.indexOf('@local/') === 0) {
      localList.update({ id: selectedMenuItem.replace('@local/', ''), code, data });
      this.setState({
        selectedObject: {
          ...selectedObject,
          code,
          data,
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
    const { selectedMenuItem, selectedObject } = this.state;

    let newSelectedMenuItem = id;
    let newSelectedObject;

    if (newSelectedMenuItem.indexOf('@local/') === 0) {
      newSelectedObject = localList.get(newSelectedMenuItem.replace('@local/', ''));
    } else if (newSelectedMenuItem.indexOf('@action/') === 0) {
      if (newSelectedMenuItem === '@action/new') {
        prompt('What do you want to name it?', 'Awesomebox', (title) => {
          const result = localList.new({ title });
          if (result && result.id) {
            newSelectedMenuItem = `@local/${result.id}`;
            newSelectedObject = result;
          }
        });
      }

      newSelectedMenuItem = selectedMenuItem;
      newSelectedObject = selectedObject;
    } else {
      newSelectedObject = list.reduce((o, c) => (c.id === newSelectedMenuItem ? c : o));
    }

    location.assign(`#${newSelectedMenuItem}`);
    this.setState({ selectedMenuItem: newSelectedMenuItem, selectedObject: newSelectedObject });
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
              <Menu.Item key="@action/new">
                <Icon type="plus" />
                {' '}
                Create new
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
        <div className="module">
          <EditorArea
            code={selectedObject.code}
            data={selectedObject.data}
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
