import React from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

const PopOver = (props: any) => {
  return (
    <div>
      <span id={`testing-${props.index}`}>
      </span>
      <Popover
        flip
        target={`testing-${props.index}`}
        toggle={props.toggle}
        isOpen={props.popOver}
      >
        <PopoverHeader></PopoverHeader>
        <PopoverBody className='tw-p-0'>
          <ul className='list-group'>
            <li className='list-group-item'>Menu Item 1</li>
            <li className='list-group-item'>Menu Item 2</li>
            <li className='list-group-item'>Menu Item 3</li>
            <li className='list-group-item'>Menu Item 4</li>
          </ul>
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default PopOver;
