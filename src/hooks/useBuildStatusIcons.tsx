import { useMemo } from "react";
import * as models from "models";
import {
  GENERATE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  EMPTY_STEP,
  DEPLOY_STEP_NAME,
} from "@hooks/useBuildSteps";

type BuildStatusIconsProps = {
  build: models.Build;
};

const useBuildStatusIcons = ({ build }: BuildStatusIconsProps) => {
  const stepGenerateCode = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === GENERATE_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  const stepBuildDocker = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find(
        (step) => step.name === BUILD_DOCKER_IMAGE_STEP_NAME
      ) || EMPTY_STEP
    );
  }, [build]);

  const stepDeploy = useMemo(() => {
    if (!build?.action?.steps?.length) {
      return EMPTY_STEP;
    }
    return (
      build.action.steps.find((step) => step.name === DEPLOY_STEP_NAME) ||
      EMPTY_STEP
    );
  }, [build]);

  const result = {
    stepGenerateCode,
    stepBuildDocker,
    stepDeploy
  };

  return result;
};


export default useBuildStatusIcons;