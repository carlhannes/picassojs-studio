import React from 'react';
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';
import localRepo from '@/core/local-repo';
import { getSrvExamples } from '@/examples';
import { ExampleItem, itemType } from '@/core/types';
import { Box } from '@/ui/box';
import CodeArea from '@/components/areas/codearea';
import ExampleList from '@/components/examplelist/examplelist';

type HomeProps = {
  examples: ExampleItem[];
};

export default function App({ examples }: HomeProps) {
  const router = useRouter();

  const pathname = router.pathname;
  
  const [localList, setLocalList] = React.useState(localRepo.list());
  const [selected, setSelected] = React.useState<itemType>(
    { id: '', code: '', data: '', title: '', description: '', language: '', tags: [] }
  );
  const [loadedData, setLoadedData] = React.useState<any>({});
  const [loadedApp, setLoadedApp] = React.useState({});
  const [loadedSheetId, setLoadedSheetId] = React.useState('');
  const [loadedObject, setLoadedObject] = React.useState({});

  React.useEffect(() => {
    if (selected && selected.id !== pathname.substr(1) && localList) {
      let [sel] = examples.concat(localList).filter((ex) => ex.id === pathname.substr(1));
      if (!sel) {
        [sel] = examples;
      }
      if (sel !== selected) {
        if (sel.appId !== loadedData?.selectedApp?.id) {
          setLoadedData({ ...(loadedData || {}), selectedApp: {} });
        } else if (sel.sheetId !== loadedData?.selectedApp?.selectedSheet?.id) {
          setLoadedData({
            ...(loadedData || {}),
            selectedApp: { ...(loadedData?.selectedApp || {}), selectedSheet: {} },
          });
        } else if (sel.objectId !== loadedData?.selectedApp?.selectedSheet?.selectedObject?.id) {
          setLoadedData({
            ...(loadedData || {}),
            selectedApp: {
              ...(loadedData?.selectedApp || {}),
              selectedSheet: { ...(loadedData?.selectedApp?.selectedSheet || {}), selectedObject: {} },
            },
          });
        }
        setSelected(sel);
      }
    }
  }, [selected, pathname, localList]);

  const onItemAdded = (title: string) => {
    const result = localRepo.new({ title });
    if (typeof result === 'string') {
      console.error(result);
    } else if (result && result.id) {
      setLocalList(localRepo.list());
      router.push(`/${result.id}`);
    }
  };

  const onItemRemoved = (id: string) => {
    const result = localRepo.delete(id);
    const next = (result && result.id) || (examples && examples[examples.length - 1].id) || '';
    setLocalList(localRepo.list());
    router.push(`/${next}`);
  };

  const doUpdateItem = React.useCallback(
    (codeData: Partial<ExampleItem>) => {
      if (selected) {
        const isLocal = localList.filter((l: itemType) => selected.id === l.id).length === 1;
        if (isLocal) {
          localRepo.update({ 
            id: selected.id, 
            ...codeData 
          });
        } else {
          const updatedCodeData = { ...selected, ...codeData };
          const result = localRepo.fork(selected, updatedCodeData);
          if (typeof result === 'string') {
            console.error(result);
          } else if (result && result.id) {
            setLocalList(localRepo.list());
            router.push(`/${result.id}`);
          }
        }
      }
    },
    [selected, localList, router]
  );

  return (
    <Box flexGrow={1} display="flex" width="100%" height="100%">
      <Box display="flex" className={styles.list}>
        <ExampleList
          entries={examples}
          locals={localList}
          selected={selected}
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
        />
      </Box>
      <Box display="flex" flexGrow={1} className={styles.code}>
        <CodeArea
          selected={selected}
          doUpdateItem={doUpdateItem}
          loadedData={loadedData}
          setLoadedData={setLoadedData}
          loadedApp={loadedApp}
          setLoadedApp={setLoadedApp}
          loadedSheetId={loadedSheetId}
          setLoadedSheetId={setLoadedSheetId}
          loadedObject={loadedObject}
          setLoadedObject={setLoadedObject}
        />
      </Box>
    </Box>
  );
}

export async function getStaticProps() {
  const examples = await getSrvExamples();
  return {
    props: {
      examples: examples,
    },
  };
}

export async function getStaticPaths() {

  const examples = await getSrvExamples();

  const paths = examples.map((ex) => (ex && ({
    params: { pathname: [`${ex.id}`] },
  }))).filter(Boolean);

  return {
    paths,
    fallback: false,
  };
};