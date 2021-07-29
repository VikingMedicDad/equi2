import { gql, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "models";
import { formatError } from "util/error";

type TData = {
  userApiTokens: models.ApiToken[];
};


const useApiTokenList = () => {
  const [newTokenState, setNewTokenState] = useState<boolean>(false);
  const [newToken, setNewToken] = useState<models.ApiToken | null>(null);
  const [error, setError] = useState<Error>();

  const handleNewTokenClick = useCallback(() => {
    setNewTokenState(!newTokenState);
  }, [newTokenState, setNewTokenState]);

  const handleNewTokenCompleted = useCallback(
    (token: models.ApiToken) => {
      setNewToken(token);
      setNewTokenState(false);
    },
    [setNewToken, setNewTokenState]
  );

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_API_TOKENS
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const result = {
    loading,
    data,
    newToken,
    newTokenState,
    error,
    errorMessage,
    errorLoading,
    setError,
    handleNewTokenClick,
    handleNewTokenCompleted
  };

  return result;
};

export default useApiTokenList;

export const GET_API_TOKENS = gql`
  query userApiTokens {
    userApiTokens {
      id
      createdAt
      updatedAt
      name
      token
      previewChars
      lastAccessAt
      userId
    }
  }
`;
