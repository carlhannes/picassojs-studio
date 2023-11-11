import React, { useEffect, useRef } from 'react';
import styles from './popover.module.scss';

interface PopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  anchorEl,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  children
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle click outside of popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && !anchorEl?.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  if (!open) {
    return null;
  }

  // Calculate position
  const anchorRect = anchorEl?.getBoundingClientRect();
  const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    top: anchorOrigin.vertical === 'bottom' ? anchorRect?.bottom : anchorRect?.top,
    left: anchorOrigin.horizontal === 'left' ? anchorRect?.left : anchorRect?.right
  };

  return (
    <div ref={popoverRef} className={styles.popover} style={popoverStyle}>
      {children}
    </div>
  );
};
