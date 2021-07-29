import { useCallback, useMemo } from "react";

import { isEmpty } from "lodash";
import { useQuery } from "@apollo/client";

import * as models from "models";
import { downloadArchive } from "@hooks/useBuildSteps";

import useBuildWatchStatus from "@hooks/useBuildWatchStatus";
import { GET_APPLICATION } from "@hooks/useApplicationHome";
import useLocalStorage from "react-use-localstorage";

export const EMPTY_STEP: models.ActionStep = {
  id: "",
  createdAt: null,
  name: "",
  status: models.EnumActionStepStatus.Waiting,
  message: "",
};

export const GENERATE_STEP_NAME = "GENERATE_APPLICATION";
export const BUILD_DOCKER_IMAGE_STEP_NAME = "BUILD_DOCKER";
export const DEPLOY_STEP_NAME = "DEPLOY_APP";
export const PUSH_TO_GITHUB_STEP_NAME = "PUSH_TO_GITHUB";

export type Props = {
  build: models.Build;
  onError: (error: Error) => void;
};

const LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP = "ShowGitHubContextHelp";
const LOCAL_STORAGE_KEY_SHOW_SANDBOX_HELP = "ShowGSandboxContextHelp";

const useBuildSummary = ({ build, onError }: Props) => {
  const { data } = useBuildWatchStatus(build);

  const [showGitHelp, setShowGitHubHelp] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_GITHUB_HELP,
    "true"
  );

  const [showSandboxHelp, setShowSandboxHelp] = useLocalStorage(
    LOCAL_STORAGE_KEY_SHOW_SANDBOX_HELP,
    "false"
  );

  const { data: appData } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: build.appId,
    },
  });

  const handleDownloadClick = useCallback(() => {
    downloadArchive(data.build.archiveURI).catch(onError);
  }, [data.build.archiveURI, onError]);

  const handleDismissHelpGitHub = useCallback(() => {
    setShowGitHubHelp("false");
    setShowSandboxHelp("true");
  }, [setShowGitHubHelp, setShowSandboxHelp]);

  const handleDismissHelpSandbox = useCallback(() => {
    setShowSandboxHelp("false");
  }, [setShowSandboxHelp]);

  const stepGenerateCode = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === GENERATE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [data.build.action]);

  const stepBuildDocker = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [data.build.action]);

  const stepDeploy = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      data.build.action.steps.find((step) => step.name === DEPLOY_STEP_NAME) ||
      null
    );
  }, [data.build.action]);

  const githubUrl = useMemo(() => {
    if (!data.build.action?.steps?.length) {
      return null;
    }
    const stepGithub = data.build.action.steps.find(
      (step) => step.name === PUSH_TO_GITHUB_STEP_NAME
    );

    const log = stepGithub?.logs?.find(
      (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
    );

    return log?.meta?.githubUrl || null;
  }, [data.build.action]);

  const deployment =
    data.build.deployments &&
    data.build.deployments.length &&
    data.build.deployments[0];

  const result = {
    data,
    appData,
    stepGenerateCode,
    stepBuildDocker,
    stepDeploy,
    githubUrl,
    deployment,
    showGitHelp,
    showSandboxHelp,
    handleDownloadClick,
    handleDismissHelpGitHub,
    handleDismissHelpSandbox
  };

  return result;
};

export default useBuildSummary;
