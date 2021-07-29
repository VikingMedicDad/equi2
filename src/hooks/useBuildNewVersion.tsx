import { useCallback, useState, useEffect } from "react";
import semver, { ReleaseType } from "semver";
import { useHistory } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

export type BuildType = {
  message: string;
};

const INITIAL_VERSION_NUMBER = "0.0.0";

enum EnumReleaseType {
  Major = "Major",
  Minor = "Minor",
  Patch = "Patch",
}

const RELEASE_TO_SEVER_TYPE: {
  [key in EnumReleaseType]: ReleaseType;
} = {
  [EnumReleaseType.Major]: "major",
  [EnumReleaseType.Minor]: "minor",
  [EnumReleaseType.Patch]: "patch",
};

export type Props = {
  applicationId: string;
  lastBuildVersion?: string;
  suggestedCommitMessage?: string;
  onComplete: () => void;
};

const useBuildNewVersion = ({
  applicationId,
  lastBuildVersion,
  suggestedCommitMessage = "",
  onComplete,
}: Props) => {
  const [releaseType, setReleaseType] = useState<EnumReleaseType>(
    EnumReleaseType.Patch
  );
  const [version, setVersion] = useState<string | null>(null);
  const history = useHistory();

  const [createBuild, { loading, error }] = useMutation<{
    createBuild: models.Build;
  }>(CREATE_BUILD, {
    onCompleted: (data) => {
      const url = `/${applicationId}/builds/${data.createBuild.id}`;
      history.push(url);

      onComplete();
    },

    variables: {
      appId: applicationId,
    },
  });

  const handleBuildButtonClick = useCallback(
    (data: BuildType) => {
      createBuild({
        variables: {
          message: data.message,
          version: version,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [createBuild, applicationId, version]
  );
  const errorMessage = error && formatError(error);

  const handleReleaseTypeChange = useCallback((type) => {
    setReleaseType(type);
  }, []);

  useEffect(() => {
    setVersion(
      semver.inc(
        lastBuildVersion || INITIAL_VERSION_NUMBER,
        RELEASE_TO_SEVER_TYPE[releaseType]
      )
    );
  }, [lastBuildVersion, releaseType]);

  const result = {
    loading,
    releaseType,
    version,
    error,
    errorMessage,
    handleBuildButtonClick,
    handleReleaseTypeChange
  };

  return result;
};

export default useBuildNewVersion;

const CREATE_BUILD = gql`
  mutation($appId: String!, $version: String!, $message: String!) {
    createBuild(
      data: {
        app: { connect: { id: $appId } }
        version: $version
        message: $message
      }
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
        steps {
          id
          name
          completedAt
          status
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
        actionId
        status
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
