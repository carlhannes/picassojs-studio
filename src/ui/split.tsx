import React, { useState, useRef, useEffect, CSSProperties } from 'react';

interface SplitProps {
  className?: string;
  minSize?: number;
  defaultSize?: string;
  split: 'vertical' | 'horizontal';
  children: React.ReactNode[];
}

const Split: React.FC<SplitProps> = ({ className, minSize = 100, defaultSize = '50%', split, children }) => {
  const [size, setSize] = useState<string | number>(defaultSize);
  const ref = useRef<HTMLDivElement>(null);
  const isVertical = split === 'vertical';
  const [resizing, setResizing] = useState(false);

  const startResizing = () => setResizing(true);

  const stopResizing = () => setResizing(false);

  const resize = (e: MouseEvent) => {
    if (!resizing || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    let newSize;

    if (isVertical) {
      newSize = e.clientX - rect.left;
    } else {
      newSize = e.clientY - rect.top;
    }

    if (newSize > minSize) {
      setSize(newSize);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [resizing]);

  const splitStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'row' : 'column',
    height: '100%',
  };

  const pane1Style = {
    flex: typeof size === 'number' ? `0 0 ${size}px` : `0 0 ${size}`,
    overflow: 'auto',
  };

  const pane2Style = {
    flex: 1,
    overflow: 'auto',
  };

  const dividerStyle = {
    background: '#000',
    cursor: isVertical ? 'col-resize' : 'row-resize',
    padding: isVertical ? '0 5px' : '5px 0',
  };

  return (
    <div ref={ref} className={className} style={splitStyle}>
      <div style={pane1Style}>{children[0]}</div>
      <div style={dividerStyle} onMouseDown={startResizing} />
      <div style={pane2Style}>{children[1]}</div>
    </div>
  );
};

export default Split;
