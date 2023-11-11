import React from 'react';

import styles from './codearea.module.scss';

import storage from '../../core/storage';
import { Box } from '@/ui/box';
import { Tab, Tabs } from '@/ui/tabs';
import Split from '@/ui/split';
import { FormControl, FormLabel, MenuItem, Select } from '@/ui/form-controls';
import { Divider } from '@/ui/divider';
import { itemType } from '@/core/types';
import EditorArea from './editorarea';
import SettingsArea from './settingsarea';
import QDataArea from '../qdata/qdataarea';
import dynamic from 'next/dynamic';

// suspense rendering area
const RenderingArea =  dynamic(() => import('./renderingarea'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const defaultPicassoSettings = {
  api: {
    chart: true,
    compose: false,
  },
  renderer: {
    prio: ['svg'],
  },
  logger: 2,
};

const defaultQDataSettings = {
  appId: '',
  sheetId: '',
  objectId: '',
};

const initialPicassoSettings = storage.getLocalStorage('pic.studio.settings', defaultPicassoSettings);
const storedTab = storage.getLocalStorage('pic.studio.tab', 0);

type TabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
};

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value === index) {
    return <>{children}</>;
  }
  return null;
}

type CodeAreaProps = {
  selected: itemType;
  doUpdateItem: (newItem: Partial<itemType>) => void;
  loadedData: any;
  setLoadedData: (newData: any) => void;
  loadedApp: any;
  setLoadedApp: (newApp: any) => void;
  loadedSheetId: string;
  setLoadedSheetId: (newSheetId: string) => void;
  loadedObject: any;
  setLoadedObject: (newObject: any) => void;
};

function CodeArea({
  selected,
  doUpdateItem,
  loadedData,
  setLoadedData,
  loadedApp,
  setLoadedApp,
  loadedSheetId,
  setLoadedSheetId,
  loadedObject,
  setLoadedObject,
}: CodeAreaProps) {
  const [currentTab, setCurrentTab] = React.useState(storedTab);
  const [renderCode, setRenderCode] = React.useState('');
  const [customData, setCustomData] = React.useState('');
  const [renderData, setRenderData] = React.useState<any>('');
  const [renderTitle, setRenderTitle] = React.useState('');
  const [settings, setSettings] = React.useState(initialPicassoSettings);
  const [qDataSettings, setQDataSettings] = React.useState(defaultQDataSettings);
  const [codeModified, setCodeModified] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(0);
  const [isFrontend, setIsFrontend] = React.useState(false);

  React.useEffect(() => {
    setIsFrontend(typeof window !== 'undefined');
  }, []);

  React.useEffect(() => {
    if (selected) {
      setCodeModified(false);
      if (typeof selected.code === 'string') {
        setRenderCode(selected.code);
      }
      if (typeof selected.data === 'string') {
        setCustomData(selected.data);
        if (!selected.dataSource) {
          setRenderData(selected.data);
        }
      }
      if (typeof selected.title === 'string') {
        setRenderTitle(selected.title);
      }
      setDataSource(Number(selected.dataSource) || 0);
      setQDataSettings({
        appId: `${selected.appId}` || '',
        sheetId: `${selected.sheetId}` || '',
        objectId: `${selected.objectId}` || '',
      });
    }
  }, [selected]);

  const onCodeChange = React.useCallback(
    (newCode: string) => {
      setCodeModified(true);
      setRenderCode(newCode);
      doUpdateItem({ code: newCode });
    },
    [doUpdateItem]
  );

  const onDataSourceChange = React.useCallback(
    (e: any) => {
      setCodeModified(true);
      if (!e.target.value && selected?.data) {
        setRenderData(selected.data);
      }
      setDataSource(e.target.value);
      doUpdateItem({ dataSource: e.target.value });
    },
    [doUpdateItem]
  );

  const onDataChange = React.useCallback(
    (newData: string) => {
      setCodeModified(true);
      setCustomData(newData);
      setRenderData(newData);
      doUpdateItem({ data: newData });
    },
    [doUpdateItem]
  );

  const onQDataChange = React.useCallback((newData: any) => {
    setCodeModified(true);
    setRenderData(newData);
  }, []);

  const onQDataSettingsChange = React.useCallback(
    (newDataSettings: any) => {
      setCodeModified(true);
      setQDataSettings(newDataSettings);
      doUpdateItem({ ...newDataSettings });
    },
    [doUpdateItem]
  );

  const onTabChange = (e: any, v: any) => {
    storage.setLocalStorage('pic.studio.tab', v);
    setCodeModified(false);
    setCurrentTab(v);
  };

  const onSettingsChanged = (newSettings: any) => {
    storage.setLocalStorage('pic.studio.settings', newSettings);
    setCodeModified(false);
    setSettings(newSettings);
  };

  return (
    <Box flexGrow={1} display="flex" className={styles.root}>
      <Split className={styles.split} minSize={100} defaultSize="50%" split="vertical">
        <Box display="flex" flexDirection="column" className={styles.code} height="100%">
          <Box square>
            <Tabs value={currentTab} onChange={onTabChange} indicatorColor="primary" centered>
              <Tab label="Code" className={styles.tab} />
              <Tab label="Data" className={styles.tab} />
              <Tab label="Settings" className={styles.tab} />
            </Tabs>
          </Box>
          <Box display="flex" flexGrow={1} height="100%" className={styles.tabpanelwrapper}>
            <TabPanel value={currentTab} index={0}>
              <EditorArea code={renderCode} onCodeChange={onCodeChange} skipCodeUpdate={codeModified} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <Box display="flex" flexGrow={1} flexDirection="column">
                <Box display="flex" className={styles.dataSource}>
                  <FormControl className={styles.formControl}>
                    <FormLabel>Data source</FormLabel>
                    <Select
                      labelId="data-source-select"
                      value={dataSource}
                      name="dataSource"
                      onChange={onDataSourceChange}
                    >
                      <MenuItem value={0}>Custom Generated Data</MenuItem>
                      <MenuItem value={1}>Data from Qlik Sense</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Divider />
                {!dataSource ? (
                  <EditorArea code={customData} onCodeChange={onDataChange} skipCodeUpdate={codeModified} />
                ) : (
                  <QDataArea
                    loadedData={loadedData}
                    setLoadedData={setLoadedData}
                    qDataSettings={qDataSettings}
                    onQDataSettingsChange={onQDataSettingsChange}
                    onQDataChange={onQDataChange}
                    loadedApp={loadedApp}
                    setLoadedApp={setLoadedApp}
                    loadedSheetId={loadedSheetId}
                    setLoadedSheetId={setLoadedSheetId}
                    loadedObject={loadedObject}
                    setLoadedObject={setLoadedObject}
                  />
                )}
              </Box>
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <SettingsArea settings={settings} onSettingsChanged={onSettingsChanged} />
            </TabPanel>
          </Box>
        </Box>
        <Box display="flex" className={styles.render}>
          {isFrontend && (<RenderingArea
            key="chart"
            api="chart"
            title={renderTitle}
            code={renderCode}
            data={renderData}
            settings={settings}
            dataSource={dataSource}
          />)}
        </Box>
      </Split>
    </Box>
  );
}

export default CodeArea;
