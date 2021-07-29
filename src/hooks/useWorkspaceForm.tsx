import { useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import * as models from "models";
import { formatError } from "util/error";
import { useTracking } from "util/analytics";
import { GET_CURRENT_WORKSPACE } from "@hooks/useWorkspaceSelector";

type TData = {
  updateWorkspace: models.Workspace;
};

function useWorkspaceForm() {
  const { data, error } = useQuery<{
    currentWorkspace: models.Workspace;
  }>(GET_CURRENT_WORKSPACE);

  const { trackEvent } = useTracking();

  const [updateWorkspace, { error: updateError }] = useMutation<TData>(
    UPDATE_WORKSPACE
  );

  const handleSubmit = useCallback(
    (newData) => {
      const { name } = newData;
      trackEvent({
        eventName: "updateWorkspaceInfo",
      });
      updateWorkspace({
        variables: {
          data: {
            name,
          },
          workspaceId: data?.currentWorkspace.id,
        },
      }).catch(console.error);
    },
    [updateWorkspace, data, trackEvent]
  );

  const errorMessage = formatError(error || updateError);

  const result = {
    data,
    handleSubmit,
    error,
    errorMessage
  };

  return result;
}

export default useWorkspaceForm;

const UPDATE_WORKSPACE = gql`
  mutation updateWorkspace(
    $data: WorkspaceUpdateInput!
    $workspaceId: String!
  ) {
    updateWorkspace(data: $data, where: { id: $workspaceId }) {
      id
      name
    }
  }
`;
