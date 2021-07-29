import React from "react";
import * as models from "models";
import useWorkspaceSelectorList from "@hooks/useWorkspaceSelectorList";
import WorkspaceSelectorListItem from "@amp-components/Workspaces/WorkspaceSelectorListItem";
import { Spin, Button, Card} from "antd";
import { FolderAddOutlined } from '@ant-design/icons';

const CLASS_NAME = "workspaces-selector__list";

type Props = {
  selectedWorkspace: models.Workspace;
  onWorkspaceSelected: (workspace: models.Workspace) => void;
  onNewWorkspaceClick: () => void;
};

function WorkspaceSelectorList({
  selectedWorkspace,
  onWorkspaceSelected,
  onNewWorkspaceClick,
}: Props) {
  
  const {
    loading,
    data,
  } = useWorkspaceSelectorList();

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <Spin />
      ) : (
        <>
         <Card
          title="Avalaible Workspaces"
          size="small"
          actions={[
            <Button
                className={`${CLASS_NAME}__add-button`}
                type="primary"
                disabled={loading}
                icon={<FolderAddOutlined />}
                onClick={onNewWorkspaceClick}
              >
                Create new workspace
            </Button>
          ]}

         >
            {data?.workspaces.map((workspace) => (
              <WorkspaceSelectorListItem
                onWorkspaceSelected={onWorkspaceSelected}
                workspace={workspace}
                selected={selectedWorkspace.id === workspace.id}
                key={workspace.id}
              />
            ))}
            
          </Card>
        </>
      )}
    </div>
  );
}

export default WorkspaceSelectorList;
