import { useCallback } from "react";
import { match } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

import * as models from "models";
import { formatError } from "util/error";

import "./EntityPage.scss";

export type Props = {
  match: match<{ application: string; entityPageId: string }>;
};

type TData = {
  EntityPage: models.EntityPage;
};

function useEntityPage({ match }: Props) {
  const { entityPageId, application } = match.params;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PAGE, {
    variables: {
      id: entityPageId,
    },
  });

  const [updateEntityPage, { error: updateError }] = useMutation(
    UPDATE_ENTITY_PAGE
  );

  const handleSubmit = useCallback(
    (data: Omit<models.EntityPage, "blockType" | "versionNumber">) => {
      let { id, ...sanitizedCreateData } = data;

      updateEntityPage({
        variables: {
          data: {
            ...sanitizedCreateData,
          },
          where: {
            id: id,
          },
        },
      }).catch(console.error);
    },
    [updateEntityPage]
  );

  const errorMessage = formatError(error || updateError);

  const result = {
    loading,
    data,
    application,
    error,
    errorMessage,
    updateError,
    handleSubmit
  };

  return result;
}

export default useEntityPage;

export const GET_ENTITY_PAGE = gql`
  query getEntityPage($id: String!) {
    EntityPage(where: { id: $id }, version: 0) {
      id
      displayName
      description
      entityId
      pageType
      showAllFields
      showFieldList
      singleRecordSettings {
        allowCreation
        allowDeletion
        allowUpdate
      }
      listSettings {
        allowCreation
        allowDeletion
        enableSearch
        navigateToPageId
      }
    }
  }
`;

const UPDATE_ENTITY_PAGE = gql`
  mutation createEntityPage(
    $data: EntityPageUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityPage(data: $data, where: $where) {
      id
      displayName
      description
      entityId
      pageType
      showAllFields
      showFieldList
      singleRecordSettings {
        allowCreation
        allowDeletion
        allowUpdate
      }
      listSettings {
        enableSearch
        navigateToPageId
      }
    }
  }
`;
