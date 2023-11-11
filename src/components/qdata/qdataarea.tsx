
import React, { ChangeEvent } from 'react';
import connect from '@/core/sense/connect';
import debouncer, { DebouncedFn } from '@/core/debounce';
import { FormControl, FormLabel, MenuItem, Select } from '@/ui/form-controls';
import { Divider } from '@/ui/divider';
import { Grid } from '@/ui/grid';
import styles from './qdataarea.module.scss';

type QDataAreaProps = {
  loadedApp: any;
  setLoadedApp: (newApp: any) => void;
  loadedSheetId: string;
  setLoadedSheetId: (newSheetId: string) => void;
  loadedObject: any;
  setLoadedObject: (newObject: any) => void;
  loadedData?: any;
  setLoadedData: (newData: any) => void;
  qDataSettings?: any;
  onQDataSettingsChange: (newSettings: any) => void;
  onQDataChange?: (newData: any) => void;
};

const QDataArea = ({ 
  loadedApp,
  setLoadedApp,
  loadedSheetId,
  setLoadedSheetId,
  loadedObject,
  setLoadedObject,
  loadedData = {}, 
  setLoadedData, 
  qDataSettings = {}, 
  onQDataSettingsChange, 
  onQDataChange }: QDataAreaProps
) => {
  const [qApps, setQApps] = React.useState(loadedData.qApps || []);
  const [sheets, setSheets] = React.useState(loadedData.selectedApp?.sheets || []);
  const [objects, setObjects] = React.useState(loadedData.selectedApp?.selectedSheet?.objects || []);
  const [appId, setAppId] = React.useState(qDataSettings.appId || '');
  const [sheetId, setSheetId] = React.useState(qDataSettings.sheetId || '');
  const [objectId, setObjectId] = React.useState(qDataSettings.objectId || '');
  const [objectLayout, setObjectLayout] = React.useState(loadedData.selectedApp?.selectedSheet?.selectedObject?.layout);
  const [disabledGetQApps, setDisabledGetQApps] = React.useState(false);
  const codeDebouncer = React.useRef<DebouncedFn>();
  let connectedApp: any;
  let liveObject: any;

  const getQApps = () => {
    setDisabledGetQApps(true);
    connect
      .getDocs()
      .then((docs: any) => {
        setDisabledGetQApps(false);
        setLoadedData({ ...loadedData, qApps: docs });
      })
      .catch(() => {
        setDisabledGetQApps(false);
        setLoadedData({ ...loadedData, qApps: [] });
      });
  };

  const connectApp = () => {
    return connect.openApp(appId).then((app: any) => {
      return app;
    });
  };

  const onAppIdSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setAppId(e.target.value);
    if (appId !== e.target.value) {
      setSheetId('');
      setObjectId('');
      onQDataSettingsChange({ appId: e.target.value, sheetId: '', objectId: '' });
    } else {
      onQDataSettingsChange({ appId: e.target.value, sheetId, objectId });
    }
  };

  const getSheetFromId = (id: string) => {
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].qInfo.qId === id) {
        return sheets[i];
      }
    }
    return undefined;
  };

  const onSheetIdSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSheetId(e.target.value);
    if (sheetId !== e.target.value) {
      setObjectId('');
      onQDataSettingsChange({ appId, sheetId: e.target.value, objectId: '' });
    } else {
      onQDataSettingsChange({ appId, sheetId: e.target.value, objectId });
    }
  };

  const onObjectIdSelect = (e: ChangeEvent<{ value: unknown }>
    ) => {
    setObjectId(e.target.value);
    onQDataSettingsChange({ appId, sheetId, objectId: e.target.value });
  };

  const resolve = (path: string, obj: any): any => {
    const arr = path.replace(/^\//, '').split(/\//);
    let container = obj;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i] && Array.isArray(container)) {
        return container.map(
          (v) => resolve(arr.slice(i + 1).join('/'), v)
        );
      }
      if (arr[i] in container) {
        container = container[arr[i]];
      }
    }

    return container;
  };

  const getData = (path: any, obj: any, layout: any, rect: any) => {
    const p = path.replace('qHyperCubeDef', 'qHyperCube');
    const cube = resolve(p, layout);
    const numCols = cube.qDimensionInfo.length + cube.qMeasureInfo.length;
    const numRows = Math.floor(10000 / numCols);
    if (cube.qMode === 'K') {
      return obj.getHyperCubeStackData(path, [
        { qLeft: rect.left || 0, qTop: 0, qHeight: numRows, qWidth: numCols - (rect.left || 0) },
      ]);
    }
    return obj.getHyperCubeData(path, [
      { qLeft: rect.left || 0, qTop: 0, qHeight: numRows, qWidth: numCols - (rect.left || 0) },
    ]);
  };

  React.useEffect(() => {
    setQApps(loadedData.qApps || []);
    setSheets(loadedData.selectedApp?.sheets || []);
    setObjects(loadedData.selectedApp?.selectedSheet?.objects || []);
    setObjectLayout(loadedData.selectedApp?.selectedSheet?.selectedObject?.layout);
  }, [loadedData]);

  React.useEffect(() => {
    setAppId(qDataSettings.appId || '');
    setSheetId(qDataSettings.sheetId || '');
    setObjectId(qDataSettings.objectId || '');
  }, [qDataSettings]);

  React.useEffect(() => {
    if (!appId || !qApps?.length) {
      return;
    }
    if (qApps.every((item: any) => item.qDocId !== appId)) {
      setAppId('');
      onQDataSettingsChange({ appId: '', sheetId, objectId });
      return;
    }
    if (appId === loadedData?.selectedApp?.id) {
      return;
    }
    const getSheetList = async () => {
      const loadApp = async () => {
        if (!connectedApp) {
          connectedApp = await connectApp();
        }
        return connectedApp.getSheetList().then((sheetList: any) => {
          if (sheetList.qAppObjectList) {
            sheetList = sheetList.qAppObjectList.qItems;
          }
          return sheetList;
        });
      };
      const sheetList = await loadApp();
      setSheets(sheetList);
      setLoadedData({ ...loadedData, selectedApp: { id: appId, sheets: sheetList } });
    };
    getSheetList();
  }, [appId, qApps]);

  React.useEffect(() => {
    if (!sheetId || !sheets?.length) {
      return;
    }
    if (sheets.every((item: any) => item.qInfo.qId !== sheetId)) {
      setSheetId('');
      onQDataSettingsChange({ appId, sheetId: '', objectId });
      return;
    }
    if (appId === loadedData?.selectedApp?.id && sheetId === loadedData?.selectedApp?.selectedSheet?.id) {
      return;
    }
    const getObjectList = async () => {
      const loadSheet = async () => {
        if (!connectedApp) {
          connectedApp = await connectApp();
        }
        const sheet = getSheetFromId(sheetId);
        const promises = sheet.qData.cells.map((cell: any) => {
          const obj = {
            type: cell.type,
            id: cell.name,
            title: '',
          };
          return connectedApp.getObject(cell.name).then((object: any) => {
            return object.getProperties().then((props: any) => {
              obj.title = props.title || '[no title]';
              return obj;
            });
          });
        });
        return Promise.all(promises).then((results) => {
          return results;
        });
      };
      const objectList = await loadSheet();
      setLoadedData({
        ...loadedData,
        selectedApp: {
          id: appId,
          sheets,
          selectedSheet: { id: sheetId, objects: objectList },
        },
      });
    };
    getObjectList();
  }, [appId, sheetId, sheets]);

  React.useEffect(() => {
    if (!objectId || !objects?.length) {
      return;
    }
    if (objects.every((item: any) => item.id !== objectId)) {
      setObjectId('');
      onQDataSettingsChange({ appId, sheetId, objectId: '' });
      return;
    }
    if (
      appId === loadedData?.selectedApp?.id &&
      sheetId === loadedData?.selectedApp?.selectedSheet?.id &&
      objectId === loadedData?.selectedApp?.selectedSheet?.selectedObject?.id
    ) {
      return;
    }
    const getObjectLayout = async () => {
      const loadObject = async () => {
        if (!connectedApp) {
          connectedApp = await connectApp();
        }
        if (liveObject) {
          liveObject.observed.dispose();
          liveObject = null;
        }
        return connectedApp
          .getLiveObject(objectId, (layout: any) => {
            if (liveObject && !layout.qSelectionInfo.qInSelections) {
              if (layout.box) {
                return Promise.all([
                  getData('/generated/box/qHyperCubeDef', liveObject.obj, layout, {}),
                  getData('/generated/outliers/qHyperCubeDef', liveObject.obj, layout, { left: 1 }),
                ]).then((values) => {
                  layout.generated.box.qHyperCube[
                    layout.generated.box.qHyperCube.qMode === 'K' ? 'qStackedDataPages' : 'qDataPages'
                  ] = values[0];
                  layout.generated.outliers.qHyperCube[
                    layout.generated.outliers.qHyperCube.qMode === 'K' ? 'qStackedDataPages' : 'qDataPages'
                  ] = values[1];
                  setObjectLayout(layout);
                  setLoadedData({
                    ...loadedData,
                    selectedApp: {
                      id: appId,
                      sheets,
                      selectedSheet: {
                        id: sheetId,
                        objects,
                        selectedObject: { id: objectId, layout },
                      },
                    },
                  });
                });
              }
              return getData('/qHyperCubeDef', liveObject.obj, layout, {}).then((pages: any) => {
                layout.qHyperCube[layout.qHyperCube.qMode === 'K' ? 'qStackedDataPages' : 'qDataPages'] = pages;
                setObjectLayout(layout);
                setLoadedData({
                  ...loadedData,
                  selectedApp: {
                    id: appId,
                    sheets,
                    selectedSheet: {
                      id: sheetId,
                      objects,
                      selectedObject: { id: objectId, layout },
                    },
                  },
                });
              });
            }
            return Promise.resolve(undefined);
          })
          .then((o: any) => {
            liveObject = o;
            return liveObject;
          });
      };
      await loadObject();
    };
    getObjectLayout();
  }, [appId, sheetId, objectId, objects]);

  React.useEffect(() => {
    if (objectLayout) {
      if (!codeDebouncer.current && onQDataChange) {
        codeDebouncer.current = debouncer(onQDataChange, 200);
      }
      if (codeDebouncer.current) {
        codeDebouncer.current(objectLayout);
      }
    }
  }, [objectLayout, onQDataChange]);

  React.useEffect(() => {
    if (onQDataChange) {
      codeDebouncer.current = debouncer(onQDataChange, 200);
    }
  }, [onQDataChange]);

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <p className={styles.title}>
          Default connection: ws://localhost:9076/app/engineData
        </p>
        <button type="button" className={styles.button} color="primary" onClick={getQApps} disabled={disabledGetQApps}>
          Click here to get apps
        </button>
      </Grid>
      {qApps.length ? (
        <>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <FormControl className={styles.formControl}>
              <FormLabel>Select an app</FormLabel>
              <Select name="app-select" labelId="app-select" value={appId} onChange={onAppIdSelect}>
                {qApps.map((item: any) => (
                  <MenuItem value={item.qDocId} key={item.qDocId}>
                    {item.qDocName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      ) : undefined}
      {qApps.length && sheets.length ? (
        <>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <FormControl className={styles.formControl}>
              <FormLabel>Select a sheet</FormLabel>
              <Select name="sheet-select" labelId="sheet-select" value={sheetId} onChange={onSheetIdSelect}>
                {sheets.map((item: any) => (
                  <MenuItem value={item.qInfo.qId} key={item.qInfo.qId}>
                    {item.qMeta.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      ) : undefined}
      {qApps.length && sheets.length && objects.length ? (
        <>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <FormControl className={styles.formControl}>
              <FormLabel>Select a chart</FormLabel>
              <Select name="chart-select" labelId="chart-select" value={objectId} onChange={onObjectIdSelect}>
                {objects.map((item: any) => (
                  <MenuItem value={item.id} key={item.id}>
                    {`${item.type} - ${item.title}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      ) : undefined}
    </Grid>
  );
};

export default QDataArea;
