import React from 'react';
import { ResizableBox } from 'react-resizable';
import './resizable.css'

interface ResizableProps {
  direction: 'horizontal' |'vertical';
  children?: React.ReactNode;
}

const Resizable = ({ direction, children }: ResizableProps) => {
  return (
    <ResizableBox
      width={220}
      height={220}
      resizeHandles={['s']}
    >
      {children}
    </ResizableBox>
  )
}

export default Resizable;
