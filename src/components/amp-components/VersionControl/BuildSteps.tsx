import React from "react";
import * as models from "models";
import { BuildStepsStatus } from "@amp-components/VersionControl/BuildStepsStatus";
import useBuildSteps, { Props } from "@hooks/useBuildSteps";
import Flex from "@components/shared-components/Flex";
import { DownloadOutlined, CodeSandboxCircleFilled , GithubFilled} from '@ant-design/icons';
import { Button, Space } from "antd";
import { DockerIcon } from "@amp-components/VersionControl/BuildStatusIcons";
const CLASS_NAME = "build-steps";

const BuildSteps = ({ build, onError }: Props) => {
  
  const {
    stepGenerateCode,
    stepGithub,
    stepBuildDocker,
    stepDeploy,
    githubUrl,
    deployment,
    data,
    handleDownloadClick
  } = useBuildSteps({
    build, onError
  });

  return (
    <Flex 
      alignItems="end"
      justifyContent="start"
      className="fluid-container"
    >
      <Space>
        <BuildStepsStatus status={stepGenerateCode.status} /> Generated Code 
        <Button 
          onClick={handleDownloadClick}
          disabled={
            stepGenerateCode.status !== models.EnumActionStepStatus.Success
          } 
          type="default" 
          className={`${CLASS_NAME}__add-button`} 
          icon={<DownloadOutlined />} 
          size={"small"} 
        />

      <BuildStepsStatus status={stepBuildDocker.status} />  Build Container
        <Button
          className={`${CLASS_NAME}__add-button`}
          type="default"
          icon={
            <>
              <DockerIcon type="icon-docker" />
            </>
          }
          onClick={handleDownloadClick}
          disabled={true || data.build.status !== models.EnumBuildStatus.Completed}
        />
      
          
        <BuildStepsStatus status={stepGithub?stepGithub.status:models.EnumActionStepStatus.Waiting} /> Push Changes to GitHub 
        <Button
          className={`${CLASS_NAME}__add-button`}
          type="default"
          icon={
            <>
              <GithubFilled />
            </>
          }
          href={githubUrl}
          target="github"
          disabled={
            !stepGithub ||
            stepGenerateCode.status !==
            models.EnumActionStepStatus.Success
          }
          size={"small"} 
        />
         
    
        <BuildStepsStatus status={stepDeploy.status} />Publish App to Sandbox
        <Button
            className={`${CLASS_NAME}__add-button`}
            type="default"
            icon={
              <>
                  <CodeSandboxCircleFilled /> 
              </>
            }
            href={deployment?.environment?.address ? deployment?.environment?.address : ''}
            disabled={
              Boolean(!(deployment && stepDeploy.status === models.EnumActionStepStatus.Success))
            }
          >
        </Button>
      </Space>
    </Flex>
  );
};

export default BuildSteps;