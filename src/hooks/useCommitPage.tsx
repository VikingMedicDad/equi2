import { gql, useQuery } from "@apollo/client";
import * as models from "models";
import { formatError } from "util/error";

const useCommitPage = ({ commitId }: any) => {

  const { data, loading, error } = useQuery<{
    commit: models.Commit;
  }>(GET_COMMIT, {
    variables: {
      commitId: commitId,
    },
  });
  const build =
    (data?.commit?.builds &&
      data?.commit?.builds.length &&
      data.commit.builds[0]) ||
    null;

  const errorMessage = formatError(error);

  const result = {
    data,
    loading,
    build,
    error,
    errorMessage,
  };

  return result;
};

export default useCommitPage;

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
