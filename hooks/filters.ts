import { useEffect } from "react";
import { Range } from "@/components/common/daterange";
import { rangeStringToRange } from "@/components/common/daterange/utils";
import { useFiltersStore } from "@/stores/filters";

export interface UseFilterStateOnChangeParams {
  line: string | null;
  range: Range;
  machineIds: string[];
}
export interface UseFilterStateOptions {
  onChange?: (data: UseFilterStateOnChangeParams) => Promise<unknown>;
}
export const useFilterState = ({ onChange }: UseFilterStateOptions = {}) => {
  const storedLine = useFiltersStore((state) => state.line);
  const storedMachineIds = useFiltersStore((state) => state.machines);
  const storedRange = useFiltersStore((state) => state.range);

  useEffect(() => {
    onChange &&
      onChange({
        line: storedLine,
        range: rangeStringToRange(storedRange),
        machineIds: storedMachineIds,
      });
  }, [storedLine, storedMachineIds, storedRange]);

  return { storedLine, storedMachineIds, storedRange };
};
