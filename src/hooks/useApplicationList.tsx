import { useCallback, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import { isMobileOnly } from "react-device-detect";
import { useTracking } from "util/analytics";

import * as models from "models";

type TData = {
  apps: Array<models.App>;
};

function useApplicationList() {
  const { trackEvent } = useTracking();
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  useEffect(() => {
    setSearchPhrase("");
  }, []);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, error, loading } = useQuery<TData>(GET_APPLICATIONS, {
    variables: {
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });
  const errorMessage = formatError(error);

  const handleNewAppClick = useCallback(() => {
    trackEvent({
      eventName: "createNewAppCardClick",
    });
  }, [trackEvent]);

  const result = {
    loading,
    isMobileOnly,
    data,
    error,
    errorMessage,
    handleSearchChange,
    handleNewAppClick
  };

  return result; 
}

export default useApplicationList;

export const GET_APPLICATIONS = gql`
  query getApplications($whereName: StringFilter) {
    apps(where: { name: $whereName }, orderBy: { createdAt: Desc }) {
      id
      name
      description
      color
      updatedAt
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        version
        createdAt
        status
        action {
          id
          createdAt
          steps {
            id
            name
            createdAt
            message
            status
            completedAt
            logs {
              id
              createdAt
              message
              meta
              level
            }
          }
        }
      }
    }
  }
`;
