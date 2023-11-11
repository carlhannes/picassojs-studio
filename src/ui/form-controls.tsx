import React, { ChangeEvent } from 'react';
import styles from './form-controls.module.scss';

interface FormControlProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const FormControl: React.FC<FormControlProps> = ({ className, style, children }) => (
  <div className={`${styles.formControl} ${className || ''}`} style={style}>
    {children}
  </div>
);

interface FormLabelProps {
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children }) => (
  <label className={styles.formLabel}>{children}</label>
);

interface SelectProps {
  labelId: string;
  value: any;
  name: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ labelId, value, name, onChange, children }) => (
  <select id={labelId} value={value} name={name} onChange={onChange} className={styles.formSelect}>
    {children}
  </select>
);

interface MenuItemProps {
  value: any;
  children: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({ value, children }) => (
  <option value={value}>{children}</option>
);
