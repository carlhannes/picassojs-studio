import React, { ReactElement } from 'react';

import styles from './tabs.module.scss';

export interface TabsProps {
  value: number;
  onChange: (event: React.MouseEvent, newValue: number) => void;
  children: ReactElement[];
  indicatorColor?: string;
  centered?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, indicatorColor, centered }) => {
  const handleTabChange = (index: number) => (event: React.MouseEvent) => {
    onChange(event, index);
  };

  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        return React.cloneElement(child, {
          // @ts-ignore
          onClick: handleTabChange(index),
          selected: index === value,
        });
      })}
    </div>
  );
};

export interface TabProps {
  label: string;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  selected?: boolean;
}

export const Tab: React.FC<TabProps> = ({ label, className, onClick, selected }) => {
  return (
    <button
      className={`${className} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}