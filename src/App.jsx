import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ListIcon from '@material-ui/icons/List';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import list from './examples';
import API from './core/api/api';
import { refresh as refreshUserState } from './core/user-state';
import localRepo from './core/local-repo';
import prompt from './core/prompt';
import confirm from './core/confirm';
import isTouchDevice from './core/generic/touch';

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

    if (location.pathname === '/callback') {
      API.refreshToken(location.search.replace('?code=', ''));
    } else {
      refreshUserState();
    }

    this.state = {
      selectedMenuItem: location.hash.replace('#', '') || list[0].id,
      defaultExamplesOpen: true,
      myExamplesOpen: true,
      fullscreenEnabled: isTouchDevice(),
      fullscreenState: 'list',
      currentRepo: localRepo,
      examples: '',
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
    const { currentRepo, selectedMenuItem } = this.state;

    this.selectItem(selectedMenuItem);

    currentRepo.list().then((examples) => {
      this.setState({ examples });
    });
  }

  onEditorChange = async ({ code: inputCode, data: inputData }) => {
    const { currentRepo, selectedMenuItem, selectedObject } = this.state;
    const { code, data } = {
      code: inputCode || selectedObject.code,
      data: inputData || selectedObject.data,
    };

    if (selectedMenuItem.indexOf('@') === 0) {
      await currentRepo.update({ id: selectedMenuItem, code, data });
      this.setState({
        selectedObject: {
          ...selectedObject,
          code,
          data,
        },
      });
    } else {
      const result = await currentRepo.fork(selectedObject);
      if (result && result.id) {
        this.selectItem(result.id);
      }
    }
  }

  onMenuClick = (item) => {
    this.selectItem(item.key);
  }

  selectItem = async (id) => {
    const { currentRepo } = this.state;
    const { location } = this.props;

    const newSelectedMenuItem = id;
    let newSelectedObject;

    if (newSelectedMenuItem.indexOf('@') === 0) {
      newSelectedObject = await currentRepo.get(newSelectedMenuItem);
    } else {
      newSelectedObject = list.reduce((o, c) => (c.id === newSelectedMenuItem ? c : o));
    }

    location.assign(`#${newSelectedMenuItem}`);
    this.setState({ selectedMenuItem: newSelectedMenuItem, selectedObject: newSelectedObject });
  }

  newItem = async () => {
    const { currentRepo } = this.state;

    prompt('What do you want to name it?', 'Awesomebox', async (title) => {
      const result = await currentRepo.new({ title });
      if (result && result.id) {
        this.selectItem(result.id);
      }
    });
  }

  deleteCurrent = async () => {
    const { currentRepo, selectedMenuItem } = this.state;

    confirm('Are you sure you want to delete this item?', async (result) => {
      if (result) {
        await currentRepo.delete(selectedMenuItem);
        this.selectItem(list[0].id);
      }
    });
  }

  render() {
    const {
      examples,
      defaultExamplesOpen,
      myExamplesOpen,
      selectedObject,
      selectedMenuItem,
      fullscreenEnabled,
      fullscreenState,
    } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <div className={`app ${fullscreenEnabled ? 'fullscreen' : ''}`}>
          <div className={`module half scroll ${fullscreenState === 'list' ? 'active' : ''}`}>
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
                  {examples.map(item => (
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
                onClick={() => this.setState({ myExamplesOpen: !myExamplesOpen })}
                style={{ borderBottom: '2px solid #F50057' }}
              >
                <ListItemText primary="My examples" />
                {myExamplesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={myExamplesOpen} timeout="auto" unmountOnExit>
                <List component="div">
                  {list.map(item => (
                    <ListItem
                      key={item.id}
                      style={{ paddingLeft: '30px' }}
                      selected={item.id === selectedMenuItem}
                      button
                      onClick={() => this.selectItem(item.id)}
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
          <div className={`module ${fullscreenState === 'code' ? 'active' : ''}`}>
            <EditorArea
              code={selectedObject.code}
              data={selectedObject.data}
              onChange={this.onEditorChange}
              onDelete={this.deleteCurrent}
              toggleFullscreen={() => this.setState({ fullscreenEnabled: !fullscreenEnabled })}
            />
          </div>
          <div className={`module ${fullscreenState === 'rendering' ? 'active' : ''}`}>
            <RenderingArea
              selectedMenuItem={selectedMenuItem}
              code={selectedObject.code}
              data={selectedObject.data}
            />
          </div>
        </div>
        <div className={`bottom ${fullscreenEnabled ? 'fullscreen' : ''}`}>
          <Paper position="static" square style={{ width: '100%' }}>
            <Tabs
              value={fullscreenState}
              onChange={(e, v) => this.setState({ fullscreenState: v })}
              variant="fullWidth"
              style={{ width: '100%' }}
            >
              <Tab icon={<ListIcon />} value="list" aria-label="list" />
              <Tab icon={<CodeIcon />} value="code" aria-label="code" />
              <Tab icon={<ImageIcon />} value="rendering" aria-label="rendering" />
            </Tabs>
          </Paper>
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
