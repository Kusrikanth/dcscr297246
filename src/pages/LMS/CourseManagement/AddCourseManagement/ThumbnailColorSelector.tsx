import { Tick02Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';

const colorOptions = [
  '#F87171', // red-400
  '#FB923C', // orange-400
  '#FBBF24', // yellow-400
  '#4ADE80', // emerald-400
  '#34D399', // green-400
  '#2DD4BF', // teal-400
  '#22D3EE', // cyan-400
  '#60A5FA', // blue-400
  '#818CF8', // indigo-400
  '#A78BFA', // purple-400
  '#E879F9', // fuchsia-400
  '#F472B6', // pink-400
  '#FCA5A5', // rose-400
  '#94A3B8', // slate-400
  '#A3A3A3', // neutral-400
];



interface ThumbnailColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ThumbnailColorSelector: React.FC<ThumbnailColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="tw-flex tw-gap-3 tw-flex-wrap" style={{ padding: "1.25rem" }}>
      {colorOptions.map((color) => (
        <div
          key={color}
          className={`tw-w-10 tw-h-10 tw-rounded-full tw-cursor-pointer tw-border-2 tw-relative tw-flex tw-items-center tw-justify-center ${selectedColor === color ? 'tw-border-primary' : 'tw-border-transparent'
            }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        >
          {selectedColor === color && (
            <div className="tw-absolute tw-text-white tw-text-sm">
              <HugeiconsIcon icon={Tick02Icon} size={21} color="#000000" />
            </div>
          )}
        </div>
      ))}
    </div>

  );
};

export default ThumbnailColorSelector;
