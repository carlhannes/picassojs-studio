import debouncer, { DebouncedFn } from '@/core/debounce';
import { Box } from '@/ui/box';
import { Editor } from '@monaco-editor/react';
import React from 'react';

const editorOptions = {
  selectOnLineNumbers: true,
  readOnly: false,
  tabSize: 2,
};

type EditorAreaProps = {
  skipCodeUpdate?: boolean;
  code: string;
  onCodeChange: (newCode: string) => void;
};

const EditorArea = ({ code, onCodeChange }: EditorAreaProps) => {
  const codeDebouncer = React.useRef<DebouncedFn | null>();

  React.useEffect(() => {
    codeDebouncer.current = debouncer(onCodeChange, 200);
  }, [onCodeChange]);

  const handleCodeChange = React.useCallback(
    (newCode: string | undefined) => {
      if (newCode && codeDebouncer.current) {
        codeDebouncer.current(newCode);
      }
    },
    [codeDebouncer]
  );

  return (
    <Box width="100%" height="100%">
      <Editor
        width="100%"
        height="100%"
        language="typescript"
        theme="vs-dark"
        value={code}
        options={editorOptions}
        onChange={handleCodeChange}
      />
    </Box>
  );
};


export default EditorArea;
