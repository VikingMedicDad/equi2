import { useMemo, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import * as models from "models";
import { formatError } from "util/error";
import { GET_BUILD } from "@hooks/useBuildWatchStatus";
import { GET_COMMIT } from "@hooks/useCommitPage";

type LogData = {
  action: models.Action;
  title: string;
  versionNumber: string;
};

const useBuildPage = ({ buildId }: any) => {

  const [error, setError] = useState<Error>();

  const [getCommit, { data: commitData }] = useLazyQuery<{
    commit: models.Commit;
  }>(GET_COMMIT);

  const { data, loading, error: errorLoading } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: buildId,
    },
    onCompleted: (data) => {
      getCommit({ variables: { commitId: data.build.commitId } });
    },
  });

  const actionLog = useMemo<LogData | null>(() => {
    if (!data?.build) return null;

    if (!data.build.action) return null;

    return {
      action: data.build.action,
      title: "Build log",
      versionNumber: data.build.version,
    };
  }, [data]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const result = {
    data,
    loading,
    commitData,
    actionLog,
    error,
    errorLoading,
    errorMessage,
    setError,
  };

  return result;
};

export default useBuildPage;
