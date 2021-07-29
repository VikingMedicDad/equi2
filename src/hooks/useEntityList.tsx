import { useState, useCallback, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { formatError } from "util/error";
import * as models from "models";
import {getLSCurrentApplication} from "@hooks/useApplicationSelector";

type TData = {
  entities: models.Entity[];
};

export type Props = {
  match: match<{ application: string }>;
};

const NAME_FIELD = "displayName";

const POLL_INTERVAL = 2000;

const useEntityList = ({ match }: Props) => {

  const application = getLSCurrentApplication() || '';

  const [error, setError] = useState<Error>();

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [newEntity, setNewEntity] = useState<boolean>(false);

  const handleNewEntityClick = useCallback(() => {
    setNewEntity(!newEntity);
  }, [newEntity, setNewEntity]);

  const {
    data,
    loading,
    error: errorLoading,
    refetch,
    stopPolling,
    startPolling,
  } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: application,
      orderBy: {
        [NAME_FIELD]: models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  //start polling with cleanup
  useEffect(() => {
    refetch().catch(console.error);
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const result = {
    loading,
    data,
    newEntity,
    application,
    error,
    errorLoading,
    errorMessage,
    setError,
    handleNewEntityClick,
    handleSearchChange
  };

  return result;
};

export default useEntityList;

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_ENTITIES = gql`
  query getEntities(
    $id: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
      lockedByUserId
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
      versions(take: 1, orderBy: { versionNumber: Desc }) {
        versionNumber
        commit {
          userId
          message
          createdAt
          user {
            id
            account {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;
