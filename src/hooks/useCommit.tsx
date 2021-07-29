import { useContext, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import { formatError } from "util/error";
import { GET_PENDING_CHANGES } from "@hooks/usePendingChanges";
import { GET_LAST_COMMIT } from "@hooks/useLastCommit";

type TCommit = {
  message: string;
};

export const INITIAL_VALUES: TCommit = {
  message: "",
};

export type Props = {
  applicationId: string;
  noChanges: boolean;
};

const useCommit = ({ applicationId, noChanges }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const [commit, { error, loading }] = useMutation(COMMIT_CHANGES, {
    onError: () => {
      pendingChangesContext.setCommitRunning(false);
      pendingChangesContext.reset();
    },
    onCompleted: () => {
      pendingChangesContext.setCommitRunning(false);
    },
    refetchQueries: [
      {
        query: GET_PENDING_CHANGES,
        variables: {
          applicationId,
        },
      },
      {
        query: GET_LAST_COMMIT,
        variables: {
          applicationId,
        },
      },
    ],
  });

  const handleSubmit = useCallback(
    (data, { resetForm }) => {
      pendingChangesContext.setCommitRunning(true);
      commit({
        variables: {
          message: data.message,
          applicationId,
        },
      }).catch(console.error);
      resetForm(INITIAL_VALUES);
      pendingChangesContext.reset();
    },
    [applicationId, commit, pendingChangesContext]
  );

  const errorMessage = formatError(error);


  const result = {
    loading,
    error,
    errorMessage,
    handleSubmit
  };

  return result;
};

export default useCommit;

const COMMIT_CHANGES = gql`
  mutation commit($message: String!, $applicationId: String!) {
    commit(
      data: { message: $message, app: { connect: { id: $applicationId } } }
    ) {
      id
    }
  }
`;
