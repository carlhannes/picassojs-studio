import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import list from './examples';
import localList from './core/local-repo';
import prompt from './core/prompt';
import confirm from './core/confirm';

import RenderingArea from './components/rendering-area/rendering-area';
import EditorArea from './components/editor-area/editor-area';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

class App extends Component {
  constructor(...props) {
    super(...props);

    const { location } = this.props;

    this.state = {
      selectedMenuItem: location.hash.replace('#', '') || list[0].id,
      defaultExamplesOpen: true,
      localExamplesOpen: true,
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

  onEditorChange = ({ code: inputCode, data: inputData }) => {
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

  onMenuClick = (item) => {
    this.selectItem(item.key);
  }

  selectItem = (id) => {
    const { location } = this.props;

    const newSelectedMenuItem = id;
    let newSelectedObject;

    if (newSelectedMenuItem.indexOf('@local/') === 0) {
      newSelectedObject = localList.get(newSelectedMenuItem.replace('@local/', ''));
    } else {
      newSelectedObject = list.reduce((o, c) => (c.id === newSelectedMenuItem ? c : o));
    }

    location.assign(`#${newSelectedMenuItem}`);
    this.setState({ selectedMenuItem: newSelectedMenuItem, selectedObject: newSelectedObject });
  }

  newItem = () => {
    prompt('What do you want to name it?', 'Awesomebox', (title) => {
      const result = localList.new({ title });
      if (result && result.id) {
        this.selectItem(`@local/${result.id}`);
      }
    });
  }

  deleteCurrent = () => {
    const { selectedMenuItem } = this.state;

    confirm('Are you sure you want to delete this item?', (result) => {
      if (result) {
        localList.delete(selectedMenuItem.replace('@local/', ''));
        this.selectItem(list[0].id);
      }
    });
  }

  render() {
    const {
      defaultExamplesOpen, localExamplesOpen, selectedObject, selectedMenuItem,
    } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <div className="app">
          <div className="module half scroll">
            <List disablePadding component="nav" style={{ width: '100%' }}>
              <ListItem
                button
                onClick={() => this.setState({ defaultExamplesOpen: !defaultExamplesOpen })}
                style={{ borderBottom: '2px solid #F50057' }}
              >
                <ListItemText primary="Default examples" />
                {defaultExamplesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={defaultExamplesOpen} timeout="auto" unmountOnExit>
                <List component="div">
                  {list.map(item => (
                    <ListItem
                      key={item.id}
                      style={{ paddingLeft: '30px' }}
                      button
                      selected={selectedMenuItem === item.id}
                      onClick={() => this.selectItem(item.id)}
                    >
                      <ListItemText primary={item.title} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <ListItem
                button
                onClick={() => this.setState({ localExamplesOpen: !localExamplesOpen })}
                style={{ borderBottom: '2px solid #F50057' }}
              >
                <ListItemText primary="Local examples" />
                {localExamplesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={localExamplesOpen} timeout="auto" unmountOnExit>
                <List component="div">
                  {localList.list().map(item => (
                    <ListItem
                      key={`@local/${item.id}`}
                      style={{ paddingLeft: '30px' }}
                      selected={`@local/${item.id}` === selectedMenuItem}
                      button
                      onClick={() => this.selectItem(`@local/${item.id}`)}
                    >
                      <ListItemText primary={item.title} />
                    </ListItem>
                  ))}
                  <ListItem
                    button
                    style={{ paddingLeft: '30px' }}
                    onClick={this.newItem}
                  >
                    <AddCircleOutlineIcon />
                    &nbsp;
                    <ListItemText primary="Create item" />
                  </ListItem>
                </List>
              </Collapse>

            </List>
          </div>
          <div className="module">
            <EditorArea
              code={selectedObject.code}
              data={selectedObject.data}
              onChange={this.onEditorChange}
              onDelete={this.deleteCurrent}
            />
          </div>
          <div className="module">
            <RenderingArea
              selectedMenuItem={selectedMenuItem}
              code={selectedObject.code}
              data={selectedObject.data}
            />
          </div>
        </div>
      </ThemeProvider>
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
