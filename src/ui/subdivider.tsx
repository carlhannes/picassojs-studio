import React from 'react';
import { Divider } from './divider';

type SubDividerProps = {
  text: string;
};

const SubDivider = ({ text }: SubDividerProps) => {
  return (
    <>
      <Divider />
      <div style={{
        padding: '3px 3px 3px 3px',
        fontSize: '11px',
      }}>{text}</div>
      <Divider />
    </>
  );
};

export default SubDivider;
