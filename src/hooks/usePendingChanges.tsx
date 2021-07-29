import { useState, useCallback, useEffect, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "util/error";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";


type TData = {
  pendingChanges: models.PendingChange[];
};

export type Props = {
  applicationId: string;
};

const usePendingChanges = ({ applicationId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const pendingChangesContext = useContext(PendingChangesContext);

  const { data, loading, error, refetch } = useQuery<TData>(
    GET_PENDING_CHANGES,
    {
      variables: {
        applicationId,
      },
    }
  );

  //refetch when pending changes object change
  useEffect(() => {
    refetch().catch(console.error);
  }, [refetch, pendingChangesContext.pendingChanges]);

  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
  }, []);

  const errorMessage = formatError(error);

  const noChanges = isEmpty(data?.pendingChanges);

  const result = {
    noChanges,
    data,
    loading,
    discardDialogOpen,
    error,
    errorMessage,
    handleToggleDiscardDialog,
    handleDiscardDialogCompleted
  };

  return result;
};

export default usePendingChanges;

export const GET_PENDING_CHANGES = gql`
  query pendingChanges($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      action
      resourceType
      versionNumber
      resource {
        __typename
        ... on Entity {
          id
          displayName
          updatedAt
          lockedByUser {
            account {
              firstName
              lastName
            }
          }
        }
        ... on Block {
          id
          displayName
          updatedAt
        }
      }
    }
  }
`;
