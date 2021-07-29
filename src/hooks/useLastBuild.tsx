import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "util/error";
import * as models from "models";

type TData = {
  builds: models.Build[];
};

export type Props = {
  applicationId: string;
};

const useLastBuild = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_LAST_BUILD,
    {
      variables: {
        appId: applicationId,
      },
    }
  );

  const lastBuild = useMemo(() => {
    if (loading || isEmpty(data?.builds)) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const result = {
    loading,
    error,
    errorMessage,
    lastBuild,
    setError
  };
  
  return result;
  
};

export default useLastBuild;

export const GET_LAST_BUILD = gql`
  query lastBuild($appId: String!) {
    builds(
      where: { app: { id: $appId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
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
          }
        }
        message
        environment {
          id
          name
          address
        }
      }
    }
  }
`;
