import { useMemo, useState, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "util/error";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

type TData = {
  commits: models.Commit[];
};

export type Props = {
  applicationId: string;
};

const useLastCommit = ({ applicationId }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_LAST_COMMIT,
    {
      variables: {
        applicationId,
      },
    }
  );

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits;
    return last;
  }, [loading, data]);

  const build = useMemo(() => {
    if (!lastCommit) return null;
    const [last] = lastCommit.builds;
    return last;
  }, [lastCommit]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const account = lastCommit?.user?.account;

  const result = {
    lastCommit,
    account,
    build,
    pendingChangesContext,
    error,
    errorMessage,
    setError
  };

  return result;
};

export default useLastCommit;

export const GET_LAST_COMMIT = gql`
  query lastCommit($applicationId: String!) {
    commits(
      where: { app: { id: $applicationId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
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
        deployments(orderBy: { createdAt: Desc }, take: 1) {
          id
          buildId
          createdAt
          status
          actionId
          message
          environment {
            id
            name
            address
          }
        }
      }
    }
  }
`;
