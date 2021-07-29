import { useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

export type Props = {
  app: models.App;
};

function useGithubSyncDetails({ app }: Props) {
  const [disableSyncWithGithub, { error: errorUpdate }] = useMutation<
    models.App
  >(DISABLE_SYNC_WITH_GITHUB);

  const handleDisableSync = useCallback(() => {
    disableSyncWithGithub({
      variables: {
        appId: app.id,
      },
    }).catch(console.error);
  }, [disableSyncWithGithub, app]);

  const errorMessage = formatError(errorUpdate);
  const repoUrl = `https://github.com/${app.githubRepo}`;

  const result = {
    repoUrl,
    errorUpdate,
    errorMessage,
    handleDisableSync
  };
  
  return result;
}

export default useGithubSyncDetails;

const DISABLE_SYNC_WITH_GITHUB = gql`
  mutation appDisableSyncWithGithubRepo($appId: String!) {
    appDisableSyncWithGithubRepo(where: { id: $appId }) {
      id
      githubSyncEnabled
      githubRepo
      githubBranch
    }
  }
`;
