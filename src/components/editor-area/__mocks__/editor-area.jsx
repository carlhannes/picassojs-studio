import React from 'react';
import PropTypes from 'prop-types';

import { Tabs } from 'antd';

import '../editor-area.css';

function EditorArea({
  code, data, onChange,
}) {
  return (
    <div className="style-tab-modifier">
      <Tabs tabPosition="bottom" style={{ width: '100%', height: '100%' }} size="small">
        <Tabs.TabPane tab="Code" key="code" style={{ width: '100%', height: '100%' }}>
          <div
            id="mockeditor"
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Data" key="data" style={{ width: '100%', height: '100%' }}>
          <div
            id="mockeditor"
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
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

EditorArea.propTypes = {
  code: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EditorArea;
