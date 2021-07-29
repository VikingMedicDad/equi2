import { useCallback, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "util/error";
import { GET_PENDING_CHANGES } from "@hooks/usePendingChanges";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

export type Props = {
  applicationId: string;
  onComplete: () => void;
  onCancel: () => void;
};

const useDiscardChanges = ({ applicationId, onComplete, onCancel }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const [discardChanges, { error, loading }] = useMutation(DISCARD_CHANGES, {
    update(cache, { data }) {
      if (!data) return;

      //remove entities from cache to reflect discarded changes
      for (var change of pendingChangesContext.pendingChanges) {
        cache.evict({
          id: cache.identify({
            id: change.resourceId,
            __typename: "Entity",
          }),
        });
      }
    },
    onCompleted: (data) => {
      pendingChangesContext.reset();
      onComplete();
    },
    refetchQueries: [
      {
        query: GET_PENDING_CHANGES,
        variables: {
          applicationId: applicationId,
        },
      },
    ],
  });

  const handleConfirm = useCallback(() => {
    discardChanges({
      variables: {
        appId: applicationId,
      },
    }).catch(console.error);
  }, [applicationId, discardChanges]);

  const errorMessage = formatError(error);

  const result = {
    loading,
    error,
    errorMessage,
    handleConfirm
  };

  return result;
};

export default useDiscardChanges;

const DISCARD_CHANGES = gql`
  mutation discardChanges($appId: String!) {
    discardPendingChanges(data: { app: { connect: { id: $appId } } })
  }
`;
