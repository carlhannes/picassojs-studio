import React, { CSSProperties } from 'react';

type BoxProps = React.PropsWithChildren<{
  display?: string;
  flexGrow?: number;
  flexDirection?: CSSProperties['flexDirection'];
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  flexWrap?: CSSProperties['flexWrap'];
  flexBasis?: string;
  flexShrink?: number;
  flex?: string;
  order?: number;
  alignSelf?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  square?: boolean;
  className?: string;
  style?: CSSProperties;
}>;

// basic box implementation
// and mimicing the behaviour of material-ui's Box component
export const Box = ({
  display = 'flex',
  flexGrow = 0,
  flexDirection = 'row',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  alignContent = 'stretch',
  flexWrap = 'nowrap',
  flexBasis = 'auto',
  flexShrink = 1,
  flex = '0 1 auto',
  order = 0,
  alignSelf = 'auto',
  width = 'auto',
  height = 'auto',
  minWidth = '0',
  minHeight = '0',
  square = false,
  children,
  className,
  style,
}: BoxProps) => {
  const rendStyle = {
    ...style,
    display,
    flexGrow,
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    flexWrap,
    flexBasis,
    flexShrink,
    flex,
    order,
    alignSelf,
    width,
    height,
    minWidth,
    minHeight,
    borderRadius: square ? '0' : '4px',
  };
  return <section style={rendStyle} className={className}>{children}</section>;
}