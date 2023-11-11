import React from 'react';
import Logo from './picasso-logo.svg';

import styles from './examplelist.module.scss';
import { Add, Checkbox, Close, CrossTab, Delete } from '@carbon/icons-react';
import { Box } from '@/ui/box';
import SubDivider from '@/ui/subdivider';
import { List } from '@/ui/listcomponent';
import { Divider } from '@/ui/divider';
import Link from 'next/link';
import { Popover } from '@/ui/popover';
import { ExampleItem } from '@/core/types';

/*
const entry = {
  id: PropTypes.string,
  title: PropTypes.string,
  code: PropTypes.string,
  data: PropTypes.string,
};

ExampleList.defaultProps = {
  locals: [],
  selected: null,
  onItemAdded: () => {},
  onItemRemoved: () => {},
};

ExampleList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape(entry)).isRequired,
  locals: PropTypes.arrayOf(PropTypes.shape(entry)),
  selected: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  onItemAdded: PropTypes.func,
  onItemRemoved: PropTypes.func,
};
*/

type ExampleListProps = {
  entries: Array<ExampleItem>;
  locals: Array<ExampleItem>;
  selected: ExampleItem;
  onItemAdded: (name: string) => void;
  onItemRemoved: (id: string) => void;
};

const ExampleList = ({ entries, locals, selected, onItemAdded, onItemRemoved }: ExampleListProps) => {
  const [showNameInput, setShowNameInput] = React.useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
  const removeAnchorEl = React.useRef<HTMLButtonElement>(null);
  const addAnchorEl = React.useRef<HTMLButtonElement>(null);
  const inputEl = React.useRef<HTMLInputElement>(null);

  const onAddClicked = () => {
    setShowNameInput(true);
  };

  const onRemoveClicked = React.useCallback(() => {
    if (selected && locals.filter((l) => l.id === selected.id).length) {
      setShowConfirmRemove(true);
    }
  }, [selected, locals]);

  const handleConfirmAdd = () => {
    const name = inputEl.current ? inputEl.current.value : '';
    if (name !== '') {
      onItemAdded(name);
      setShowNameInput(false);
    }
  };

  const handleConfirmRemove = React.useCallback(() => {
    if (selected) {
      onItemRemoved(selected.id);
      setShowConfirmRemove(false);
    }
  }, [selected, onItemRemoved]);

  const handleClosePopup = () => {
    setShowNameInput(false);
    setShowConfirmRemove(false);
  };

  const handleKeyPressed = (event: any) => {
    if (event.key === 'Enter') {
      const name = event.target.value;
      if (name !== '') {
        onItemAdded(name);
        setShowNameInput(false);
      }
      event.preventDefault();
    }
  };

  const exampleEntries = entries.map((entry) => (
    <div key={entry.id} className={selected && selected.id === entry.id ? styles.selected : ''}>
      <Link href={`/${entry.id}`}>
        {entry.title}
      </Link>
    </div>
  ));
  const localEntries = locals.map((entry) => (
    <div key={entry.id} className={selected && selected.id === entry.id ? styles.selected : ''}>
      <Link href={`/${entry.id}`}>
        {entry.title}
      </Link>
    </div>
  ));
  return (
    <Box square className={styles.root} flexDirection="column">
      <div className={styles.header}>
        <img src={Logo} alt="picasso logo" />
      </div>
      <SubDivider text="Picasso Examples" />
      <List dense className={styles.list} component="nav">
        {exampleEntries}
      </List>
      <SubDivider text="Custom Examples" />
      <List dense className={styles.list} component="nav">
        {localEntries}
      </List>
      <Divider />
      <List dense className={styles.list} component="nav">
        <button type="button" onClick={onAddClicked} ref={addAnchorEl}>
          <Add />
          Add
        </button>
        <button type="button" onClick={onRemoveClicked} ref={removeAnchorEl}>
          <Delete />
          Remove
        </button>
      </List>
      <Popover
        open={showNameInput}
        anchorEl={addAnchorEl.current}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box display="flex" alignItems="center">
          <input
            placeholder="Name"
            onKeyPress={handleKeyPressed}
            ref={inputEl}
            autoFocus
          />
          <button type="button" color="primary" onClick={handleConfirmAdd}>
            <Checkbox />
          </button>
          <button type="button" color="secondary" onClick={handleClosePopup}>
            <Close />
          </button>
        </Box>
      </Popover>
      <Popover
        open={showConfirmRemove}
        anchorEl={removeAnchorEl.current}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box display="flex" alignItems="center">
          <h4>{`Remove "${selected && selected.title}"?`}</h4>
          <button type="button" color="primary" onClick={handleConfirmRemove}>
            <Checkbox />
          </button>
          <button type="button" color="secondary" onClick={handleClosePopup}>
            <Close />
          </button>
        </Box>
      </Popover>
    </Box>
  );
};

export default ExampleList;