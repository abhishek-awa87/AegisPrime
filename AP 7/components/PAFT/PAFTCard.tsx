import React from 'react';
import PAFTPill from './PAFTPill';

interface PAFTCardProps<T extends string> {
  title: string;
  description: string;
  options: readonly T[];
  selection: T | T[];
  onSelect: (option: T) => void;
  isMultiSelect?: boolean;
}

function PAFTCard<T extends string>({
  title,
  description,
  options,
  selection,
  onSelect,
  isMultiSelect = false,
}: PAFTCardProps<T>) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg">
      <div>
        <h3 className="font-semibold text-text-light dark:text-text-dark">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          return (
            <PAFTPill
              key={option}
              label={option}
              isSelected={isMultiSelect ? (selection as T[]).includes(option) : selection === option}
              onClick={() => onSelect(option)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PAFTCard;