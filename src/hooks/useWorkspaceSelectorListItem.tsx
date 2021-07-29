import { useCallback } from "react";
import * as models from "models";

export type Props = {
  workspace: models.Workspace;
  selected: boolean;
  onWorkspaceSelected: (workspace: models.Workspace) => void;
};

function useWorkspaceSelectorListItem({
  workspace,
  selected,
  onWorkspaceSelected,
}: Props) {

  const handleClick = useCallback(() => {
    onWorkspaceSelected && onWorkspaceSelected(workspace);
  }, [onWorkspaceSelected, workspace]);

  const result = {
    handleClick
  }
  
  return result;
  
}

export default useWorkspaceSelectorListItem;
