import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import MonacoEditor from 'react-monaco-editor';

import API from '../../core/api/api';
import { getUser } from '../../core/user-state';

import './editor-area.css';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ width: '100%', height: '100%' }}
      {...other}
    >
      {children}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  children: null,
};


function EditorArea({
  code, data, onChange, onDelete, toggleFullscreen,
}) {
  const [selectedTabPane, setSelectedTabPane] = React.useState(0);
  const [userState, setUserState] = React.useState(null);

  const tabChange = async (event, newValue) => {
    if (newValue === 'delete') {
      onDelete();
      return;
    }
    if (newValue === 'fullscreen') {
      toggleFullscreen();
      return;
    }
    if (newValue === 'login') {
      API.login();
    }
    if (newValue === 'logout') {
      API.logout();
    }
    setSelectedTabPane(newValue);
  };

  if (userState === null) {
    getUser().then((user) => {
      setUserState(user);
    });
  }

  return (
    <div className="style-tab-modifier">
      <Paper position="static" square>
        <Tabs value={selectedTabPane} onChange={tabChange} style={{ height: '50px' }}>
          <Tab label="Settings" />
          <Tab label="Data" />
          {userState && userState.loggedin ? <Tab label="Logout" value="logout" /> : <Tab label="Login" value="login" />}
          <Tab icon={<DeleteIcon />} value="delete" style={{ marginLeft: 'auto', minWidth: '50px' }} />
          <Tab icon={<FullscreenIcon />} value="fullscreen" style={{ minWidth: '50px' }} />
        </Tabs>
      </Paper>
      <TabPanel value={selectedTabPane} index={0}>
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
          onChange={newCode => onChange({ code: newCode })}
        />
      </TabPanel>
      <TabPanel value={selectedTabPane} index={1}>
        <MonacoEditor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
          }}
          value={data}
          onChange={newData => onChange({ data: newData })}
        />
      </TabPanel>
    </div>
  );
}

EditorArea.propTypes = {
  code: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
};

export default EditorArea;
