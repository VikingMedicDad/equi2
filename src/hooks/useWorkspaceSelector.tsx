import { useCallback, useEffect, useState } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { setToken } from "authentication/authentication";
import * as models from "models";
import { CURRENT_APPLICATION } from "@hooks/useApplicationSelector";

type TData = {
  currentWorkspace: models.Workspace;
};

type TSetData = {
  setCurrentWorkspace: {
    token: string;
  };
};

function useWorkspaceSelector() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [newWorkspace, setNewWorkspace] = useState<boolean>(false);

  const apolloClient = useApolloClient();
  const history = useHistory();

  const [setCurrentWorkspace, { data: setCurrentData }] = useMutation<TSetData>(
    SET_CURRENT_WORKSPACE
  );

  const handleSetCurrentWorkspace = useCallback(
    (workspace: models.Workspace) => {
      setIsOpen(false);
      localStorage.removeItem(CURRENT_APPLICATION);
      setCurrentWorkspace({
        variables: {
          workspaceId: workspace.id,
        },
      }).catch(console.error);
    },
    [setCurrentWorkspace]
  );

  useEffect(() => {
    if (setCurrentData) {
      apolloClient.clearStore();
      setToken(setCurrentData.setCurrentWorkspace.token);
      history.replace("/app/workspaces");
      window.location.reload();
    }
  }, [setCurrentData, history, apolloClient]);

  const handleNewWorkspaceClick = useCallback(() => {
    setNewWorkspace(!newWorkspace);
  }, [newWorkspace, setNewWorkspace]);

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  const { data, loading } = useQuery<TData>(GET_CURRENT_WORKSPACE);

  const result = {
    loading,
    isOpen,
    data,
    newWorkspace,
    handleNewWorkspaceClick,
    handleSetCurrentWorkspace,
    handleOpen
  };
  
  return result;

}

export default useWorkspaceSelector;

export const GET_CURRENT_WORKSPACE = gql`
  query getCurrentWorkspace {
    currentWorkspace {
      id
      name
    }
  }
`;

const SET_CURRENT_WORKSPACE = gql`
  mutation setCurrentWorkspace($workspaceId: String!) {
    setCurrentWorkspace(data: { id: $workspaceId }) {
      token
    }
  }
`;
