import { useState, useCallback } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import * as models from "models";
import { formatError } from "util/error";
import useNavigationTabs from "@hooks/useNavigationTabs";
import { GET_PENDING_CHANGES } from "@hooks/usePendingChanges";

export type Props = {
  match: match<{ application: string; commitId: string }>;
};

type TData = {
  pendingChanges: models.PendingChange[];
};

const NAVIGATION_KEY = "PENDING_CHANGES";
const SPLIT = "Split";

const usePendingChangesPage = ({ match }: Props) => {
  const { application } = match.params;
  const [splitView, setSplitView] = useState<boolean>(false);

  useNavigationTabs(application, NAVIGATION_KEY, match.url, "Pending Changes");

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );
  const { data, error } = useQuery<TData>(GET_PENDING_CHANGES, {
    variables: {
      applicationId: application,
    },
  });

  const errorMessage = formatError(error);

  const result = {
    data,
    splitView,
    error,
    errorMessage,
    handleChangeType
  };

  return result; 
};

export default usePendingChangesPage;

export const GET_COMMIT = gql`
  query Commit($commitId: String!) {
    commit(where: { id: $commitId }) {
      id
      message
      createdAt
      user {
        id
        account {
          firstName
          lastName
        }
      }
      changes {
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
          }
          ... on Block {
            id
            displayName
            updatedAt
          }
        }
      }
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        createdAt
        appId
        version
        message
        createdAt
        commitId
        actionId
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
        createdBy {
          id
          account {
            firstName
            lastName
          }
        }
        status
        archiveURI
      }
    }
  }
`;
