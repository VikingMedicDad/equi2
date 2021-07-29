import { gql, useMutation, Reference } from "@apollo/client";
import { useCallback } from "react";
import * as models from "models";
import { useTracking } from "util/analytics";
import { formatError } from "util/error";
import { CROSS_OS_CTRL_ENTER } from "util/hotkeys";

type DType = {
  createApiToken: models.ApiToken;
};

export type Props = {
  onCompleted: (token: models.ApiToken) => void;
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const useNewApiToken = ({ onCompleted }: Props) => {
  const { trackEvent } = useTracking();

  const [createApiToken, { error, loading }] = useMutation<DType>(
    CREATE_API_TOKEN,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "createApiToken",
          tokenName: data.createApiToken.name,
        });
        onCompleted(data.createApiToken);
      },
      update(cache, { data }) {
        if (!data) return;

        const newToken = data.createApiToken;

        cache.modify({
          fields: {
            userApiTokens(existingTokenRefs = [], { readField }) {
              const newTokenRef = cache.writeFragment({
                data: newToken,
                fragment: NEW_API_TOKEN_FRAGMENT,
              });

              if (
                existingTokenRefs.some(
                  (TokenRef: Reference) =>
                    readField("id", TokenRef) === newToken.id
                )
              ) {
                return existingTokenRefs;
              }

              return [newTokenRef, ...existingTokenRefs];
            },
          },
        });
      },
    }
  );

  const handleSubmit = useCallback(
    (data: models.ApiTokenCreateInput) => {
      createApiToken({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [createApiToken]
  );

  const errorMessage = formatError(error);
  
  const result = {
    loading,
    keyMap,
    error,
    errorMessage,
    handleSubmit
  };

  return result;
};

export default useNewApiToken;

const CREATE_API_TOKEN = gql`
  mutation createApiToken($data: ApiTokenCreateInput!) {
    createApiToken(data: $data) {
      id
      createdAt
      updatedAt
      name
      userId
      token
      previewChars
      lastAccessAt
    }
  }
`;

const NEW_API_TOKEN_FRAGMENT = gql`
  fragment NewUserApiToken on userApiToken {
    id
    createdAt
    updatedAt
    name
    userId
    token
    previewChars
    lastAccessAt
  }
`;
