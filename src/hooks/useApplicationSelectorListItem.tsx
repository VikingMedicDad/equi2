import { useCallback } from "react";
import { Props as ApplicationProps } from "@hooks/useApplicationListItem";
export type Props = {
  application?: ApplicationProps;
  selected?: boolean;
  onApplicationSelected: (application: ApplicationProps) => void;
};

function useApplicationSelectorListItem({
  application,
  selected,
  onApplicationSelected,
}: Props) {

  const handleClick = useCallback(() => {
    onApplicationSelected && onApplicationSelected(application);
  }, [onApplicationSelected, application]);

  const result = {
    handleClick
  }
  
  return result;
  
}

export default useApplicationSelectorListItem;
