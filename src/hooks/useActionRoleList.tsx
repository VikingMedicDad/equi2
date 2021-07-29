import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import * as models from "models";

const useActionRoleList = ({
  selectedRoleIds,
  debounceMS,
  onChange,
}: any) => {
  const [selectedRoleList, setSelectedRoleList] = useState<Set<string>>(
    selectedRoleIds
  );

  // onChange is wrapped with a useDebouncedCallback so it won't be called more often than defined in debounceMs
  // This function is called by handleRoleSelect as it can not manage dependencies
  const [debouncedOnChange] = useDebouncedCallback((value: Set<string>) => {
    onChange(value);
  }, debounceMS);

  const handleRoleSelect = useCallback(
    ({ id }: models.AppRole, checked: boolean) => {
      const newSet = new Set(selectedRoleList);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      setSelectedRoleList(newSet);
      debouncedOnChange(newSet);
    },
    [setSelectedRoleList, selectedRoleList, debouncedOnChange]
  );
  
  const result = {
    handleRoleSelect,
    selectedRoleList
  };
  
  return result;

};

export default useActionRoleList;
