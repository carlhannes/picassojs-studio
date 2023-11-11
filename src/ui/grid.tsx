import React from 'react';

type GridProps = React.PropsWithChildren<{
  container?: boolean;
  item?: boolean;
  spacing?: number; // Assuming spacing is in the unit of theme spacing, e.g., 8px
  direction?: 'row' | 'column';
  className?: string;
}>;

export const Grid: React.FC<GridProps> = ({ 
  container = false, 
  item = false, 
  spacing = 0, 
  direction = 'row', 
  className, 
  children 
}) => {
  const style = {
    display: container ? 'flex' : undefined,
    flexDirection: container ? direction : undefined,
    margin: container ? -spacing / 2 : undefined,
    padding: item ? spacing / 2 : undefined,
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};
