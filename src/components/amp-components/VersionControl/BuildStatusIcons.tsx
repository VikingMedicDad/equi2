import React from "react";
import * as models from "models";
import { Tooltip } from "antd";
import { BuildStepsStatus } from "@amp-components/VersionControl/BuildStepsStatus";
import "./BuildStatusIcons.scss";
import useBuildStatusIcons from "@hooks/useBuildStatusIcons";
import { CodeOutlined, CodeSandboxOutlined} from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';

const CLASS_NAME = "build-status-icons";
const TOOLTIP_DIRECTION = "topLeft";


type BuildStatusIconsProps = {
  build: models.Build;
};

export const DockerIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2654793_etl4xgaf9r.js', // 在 iconfont.cn 上生成
});

export const BuildStatusIcons = ({ build }: BuildStatusIconsProps) => {
  
  const {
    stepGenerateCode,
    stepBuildDocker,
    stepDeploy
  } = useBuildStatusIcons({ build });

  return (
    <>
      <Tooltip
        placement={TOOLTIP_DIRECTION}
        title="Generate Code"
        autoAdjustOverflow={true}
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepGenerateCode.status} />
        <CodeOutlined />
      </Tooltip>
      <Tooltip
        placement={TOOLTIP_DIRECTION}
        title="Build Container"
        autoAdjustOverflow={true}
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepBuildDocker.status} />
        <DockerIcon type="icon-docker" />
      </Tooltip>
      <Tooltip
        placement={TOOLTIP_DIRECTION}
        title="Publish App to Sandbox"
        autoAdjustOverflow={true}
        className={`${CLASS_NAME}__status`}
      >
        <BuildStepsStatus status={stepDeploy?.status} />
        <CodeSandboxOutlined />
      </Tooltip>
    </>
  );
};
