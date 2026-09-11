import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Tick02Icon } from '@hugeicons-pro/core-stroke-standard';
import { default as CorrectIcon } from "../../assets/imagesdps/common_icon/correct_icon.svg?react";

export interface OptionType {
  id: string;
  name: string;
  children?: OptionType[];
}

interface SubMenuMultiSelectProps {
  options: OptionType[];
  labelText?: string;
  labelClass?: string;
  placeholder?: string;
  value: OptionType[];
  onChange: (val: OptionType[]) => void;
  isDisabled?: boolean;
  error?: string;
  invalid?: boolean;
}

const SubMenuDropdown: React.FC<{
  options: OptionType[];
  activePath: string[];
  setActivePath: (path: string[]) => void;
  value: OptionType[];
  onChange: (val: OptionType[]) => void;
}> = ({ options, activePath, setActivePath, value = [], onChange }) => {
  const getOptionsAtLevel = (options: OptionType[], path: string[], level: number): OptionType[] => {
    let currentOptions = options;
    for (let i = 0; i < level; i++) {
      const found = currentOptions.find((opt) => opt.id === path[i]);
      if (found && found.children) {
        currentOptions = found.children;
      } else {
        return [];
      }
    }
    return currentOptions;
  };

  const levels: { options: OptionType[]; level: number }[] = [];
  for (let i = 0; i <= activePath.length; i++) {
    const levelOptions = getOptionsAtLevel(options, activePath, i);
    if (levelOptions.length > 0) {
      levels.push({ options: levelOptions, level: i });
    }
  }

  return (
    <div className="tw-flex tw-items-start tw-overflow-x-hidden">
      {levels.map(({ options: levelOptions, level }, idx) => (
        <ul
          key={level}
          className={classNames(
            'tw-bg-white tw-min-w-[200px] tw-p-2 tw-max-h-[200px] tw-min-h-[200px] tw-overflow-y-auto submenu-fade-in tw-mb-0',
            {
              'tw-border-r tw-border-gray-200': idx !== levels.length - 1 
            }
          )}
          style={{ animationDelay: `${level * 60}ms` }}
        >
          {levelOptions.map((option) => {
           const isSelected = (value ?? []).some((v) => v.id === option.id);
            const isActive = activePath[level] === option.id;
            const hasChildren = option.children?.length ?? 0 > 0;

            return (
              <li
                key={option.id}
                className={classNames(
                  'submenu-tree-item tw-cursor-pointer tw-py-1 tw-px-2 tw-rounded tw-flex tw-items-center mb-1',
                  { active: isActive }
                )}
                style={{
                  color: isActive || isSelected ? '#0ab39c' : 'inherit',
                  fontWeight: isActive || isSelected ? 'bold' : 'normal',
                }}
                onClick={() => {
                  if (hasChildren) {
                    const newPath = [...activePath.slice(0, level), option.id];
                    setActivePath(newPath);
                  } else {
                    let updated: OptionType[] = [];
                    if (isSelected) {
                      updated = value.filter((v) => v.id !== option.id);
                    } else {
                      updated = [...value, option];
                    }
                    onChange(updated);
                  }
                }}
              >
                <span className="tw-inline-block tw-w-[8px] tw-me-3 tw-flex-shrink-0">
                  {isSelected && !hasChildren && <HugeiconsIcon icon={Tick02Icon} size={20} className='tw-pr-1 tw-text-[#0ab39c] tw-font-medium' />}
                </span>
                <span className="tw-flex-grow">{option.name}</span>
                {hasChildren && <HugeiconsIcon icon={ArrowRight01Icon} size={14} className='tw-text-[#0ab39c]' />}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
};

const findPathToValue = (options: OptionType[], targetId: string, path: string[] = []): string[] | null => {
  for (const option of options) {
    const newPath = [...path, option.id];
    if (option.id === targetId) return newPath;
    if (option.children) {
      const childPath = findPathToValue(option.children, targetId, newPath);
      if (childPath) return childPath;
    }
  }
  return null;
};

const SubMenuMultiSelect: React.FC<SubMenuMultiSelectProps> = ({
  options,
  labelText,
  labelClass,
  placeholder = 'Select',
  value,
  onChange,
  isDisabled,
  error,
  invalid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActivePath([]);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDropdownOpen = () => {
    if (isDisabled) return;
    setIsOpen((prev) => !prev);
    setActivePath([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') handleDropdownOpen();
  };

  const renderChip = () => {
    if (!value || value.length === 0) {
      return <span className="tw-text-[#777]">{placeholder}</span>;
    }
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {value.map((item) => (
          <span
            key={item.id}
            className="tw-bg-[#E8F0FE] tw-rounded-full tw-px-2 tw-py-1 tw-text-sm tw-flex tw-items-center"
          >
            {item.name}
            <span
              className="tw-ml-2 tw-cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((v) => v.id !== item.id));
              }}
            >
              &times;
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={classNames('multiselect-checkbox tw-relative tw-w-full', { 'is-invalid': invalid })} ref={dropdownRef}>
      {labelText && <label className={labelClass}>{labelText}</label>}
      <div
        tabIndex={0}
        role="button"
        className={classNames('dropdown-btn', { disabled: isDisabled, 'is-open': isOpen })}
        onClick={handleDropdownOpen}
        onKeyDown={handleKeyDown}
      >
        {renderChip()}
      </div>
      {isOpen && (
        <div className="custom-input-animations tw-pt-2">
          <div className="tw-absolute tw-z-50 dropdown-fade-in tw-shadow-lg tw-border tw-bg-white">
            <SubMenuDropdown
              options={options}
              activePath={activePath}
              setActivePath={setActivePath}
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
      )}
      {error && invalid && <div className="invalid-feedback tw-block">{error}</div>}
    </div>
  );
};

export default SubMenuMultiSelect;