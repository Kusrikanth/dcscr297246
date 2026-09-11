import React from 'react';
import { Tooltip } from 'react-tooltip';

interface CustomTooltipProps {
  id: string;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';
  delay?: number;
  className?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  id,
  content,
  placement = 'bottom',
  delay = 0,
  className = '',
}) => {
  return (
    <Tooltip
      id={id}
      place={placement}
      content={typeof content === 'string' ? content : String(content)}
      delayShow={delay}
      className={`custom-tooltip bg-[#242424] tw-text-white tw-p-2 tw-pb-1 tw-pt-1 tw-rounded tw-text-xs tw-z-[9999] ${className}`}
    />
  );
};

export default CustomTooltip;