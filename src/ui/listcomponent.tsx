import React from 'react';
import styles from './listcomponent.module.scss';

// ListProps type
interface ListProps {
  dense?: boolean;
  className?: string;
  component?: React.ElementType;
  children: React.ReactNode;
}

// List component
export const List: React.FC<ListProps> = ({ dense, className, component: Component = 'div', children }) => {
  const listClass = `${dense ? styles.listdense : styles.list} ${className || ''}`;
  return <Component className={listClass}>{children}</Component>;
};

// ListItemProps type
interface ListItemProps {
  dense?: boolean;
  button?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

// ListItem component
export const ListItem: React.FC<ListItemProps> = ({ dense, button, onClick, children, className }) => {
  const listItemClass = `${dense ? styles.listitemdense : styles.listitem} ${button ? styles.button : ''} ${className || ''}`;
  return <div className={listItemClass} onClick={button ? onClick : undefined}>{children}</div>;
};
