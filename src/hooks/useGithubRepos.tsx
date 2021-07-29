import { useCallback } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

export type Props = {
  app: models.App;
  isAuthenticatedWithGithub?:boolean;
};

function useGithubRepos({ app }: Props) {
  const applicationId= app.id;
  const { data, error, loading, refetch, networkStatus } = useQuery<{
    appAvailableGithubRepos: models.GithubRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [enableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(ENABLE_SYNC_WITH_GITHUB, {
    onCompleted: () => {
      //onCompleted();
    },
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRepoSelected = useCallback(
    (data: models.GithubRepo) => {
      enableSyncWithGithub({
        variables: {
          githubRepo: data.fullName,
          githubBranch: null,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [enableSyncWithGithub, applicationId]
  );

  const errorMessage = formatError(error || errorUpdate);

  const result = {
    loading,
    networkStatus,
    data,
    error,
    errorUpdate,
    errorMessage,
    handleRefresh,
    handleRepoSelected
  };

  return result; 
}

export default useGithubRepos;

const FIND_GITHUB_REPOS = gql`
  query appAvailableGithubRepos($id: String!) {
    appAvailableGithubRepos(where: { app: { id: $id } }) {
      name
      url
      private
      fullName
      admin
    }
  }
`;

const ENABLE_SYNC_WITH_GITHUB = gql`
  mutation appEnableSyncWithGithubRepo(
    $githubRepo: String!
    $githubBranch: String
    $appId: String!
  ) {
    appEnableSyncWithGithubRepo(
      data: { githubRepo: $githubRepo, githubBranch: $githubBranch }
      where: { id: $appId }
    ) {
      id
      githubSyncEnabled
      githubRepo
      githubBranch
    }
  }
`;
