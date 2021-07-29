import { useCallback } from "react";
import * as models from "models";

export type Props = {
  repo: models.GithubRepo;
  onSelectRepo: (repo: models.GithubRepo) => void;
  isCurrentRepo?:boolean;
};

function useGithubRepoItem({ repo, onSelectRepo }: Props) {
  const handleRepoSelected = useCallback(
    (data: models.GithubRepo) => {
      onSelectRepo(data);
    },
    [onSelectRepo]
  );

  const result = {
    handleRepoSelected
  }

  return result;
}

export default useGithubRepoItem;
