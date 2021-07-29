import classNames from "classnames";
import React from "react";
import useWorkspaceSelectorListItem, { Props } from "@hooks/useWorkspaceSelectorListItem";
import { FolderOutlined } from "@ant-design/icons";
import { Button } from "antd";
const CLASS_NAME = "workspaces-selector__list__item";

function WorkspaceSelectorListItem({
  workspace,
  selected,
  onWorkspaceSelected,
}: Props) {
  
  const { handleClick } = useWorkspaceSelectorListItem({
    workspace,
    selected,
    onWorkspaceSelected
  });

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}--active`]: selected,
      })}
      onClick={handleClick}
    >
      <Button className={`${CLASS_NAME}__name`} type="dashed" block><FolderOutlined /> {workspace.name}</Button>
    </div>
  );
}

export default WorkspaceSelectorListItem;
