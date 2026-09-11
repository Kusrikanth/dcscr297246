import { useState } from "react";

export function hasStateChanged(newState: any, ignoredKeys: string[]) {
  let count: number = 0;
  let showState: boolean = false;

  for (const key in newState) {
    const newValue = newState[key];

    if (newValue) {
      showState = true;
      if(!ignoredKeys.includes(key)){
        count += 1;
      }
    }
  }

  return { stateChange: showState, count };
}

interface IFilterState {
  ignoredKeys: string[],
  keys: Record<string, any>,
}

export function useFilterState() {

  const [filterInfo, setFilterInfo] = useState<{ count: number | null; showClearFilterState: boolean }>({
    count: null,
    showClearFilterState: false
  });

  function advanceFilterChange({ keys, ignoredKeys }: IFilterState) {
    const { stateChange, count } = hasStateChanged(keys, ignoredKeys);
    setFilterInfo({
      showClearFilterState: stateChange,
      count: count === 0 ? null : count,
    });
  }

  return { ...filterInfo, advanceFilterChange };
  
}
