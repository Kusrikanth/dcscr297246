// StatusLabelWithPopover.tsx
import React, { useState } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

interface IStatusLabel {
  id: string;
  index: number;
  labelName: string;
}

const StatusLabelWithPopover = ({ id, index, labelName }: IStatusLabel) => {
  const [popOver, setPopOver] = useState(false);

  const togglePopOver = () => {
    setPopOver(!popOver);
  };

  return (
    <div style={{ minWidth: '7rem' }}>
      <button
        data-id={index}
        className="badge tw-uppercase badge-soft-warning tw-border-0 tw-p-2 tw-mr-2"
        onClick={togglePopOver}
      >
        {labelName}
      </button>
      <Popover target={`testing-${index}`} isOpen={popOver} toggle={togglePopOver}>
        <PopoverHeader></PopoverHeader>
        <PopoverBody className="tw-p-0">
          {/* Content for Popover */}
          <p>Your Popover Content Goes Here</p>
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default StatusLabelWithPopover;
