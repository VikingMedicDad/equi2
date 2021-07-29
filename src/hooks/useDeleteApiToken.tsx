import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "models";
import { GET_API_TOKENS } from "@hooks/useApiTokenList";

type DType = {
  deleteApiToken: { id: string };
};

export type Props = {
  apiToken: models.ApiToken;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const useDeleteApiToken = ({ apiToken, onDelete, onError }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteApiToken, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_API_TOKEN,
    {
      refetchQueries: [{ query: GET_API_TOKENS }],
      onCompleted: (data) => {
        onDelete && onDelete();
      },
    }
  );

  const handleDelete = useCallback(
    
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteApiToken({
      variables: {
        apiTokenId: apiToken.id,
      },
    }).catch(onError);
  }, [apiToken, deleteApiToken, onError]);

  const result = {
    confirmDelete,
    deleteLoading,
    handleDelete,
    handleConfirmDelete,
    handleDismissDelete
  };

  return result;
};

export default useDeleteApiToken;

const DELETE_API_TOKEN = gql`
  mutation deleteApiToken($apiTokenId: String!) {
    deleteApiToken(where: { id: $apiTokenId }) {
      id
    }
  }
`;
