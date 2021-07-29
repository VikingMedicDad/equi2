import React from "react";
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone, WarningTwoTone, FieldTimeOutlined } from '@ant-design/icons';
import * as models from "models";
import { STEP_STATUS_TO_ICON } from "./constants";
import "./BuildStepStatus.scss";


const CLASS_NAME = "build-step-status";

type Props = {
  status: models.EnumActionStepStatus;
};


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const BuildStatusIcon = ({status}: Props) => {
  switch(STEP_STATUS_TO_ICON[status]){
    case 'check':
      return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
    case 'close':
      return <WarningTwoTone twoToneColor="#ffcc00"/>;
    case 'circle_loader':
      return <FieldTimeOutlined />;
    default:
      return <></>;
  }
}

export const BuildStepsStatus = ({ status }: Props) => {
  return (
    <span className={`${CLASS_NAME} ${CLASS_NAME}--${status.toLowerCase()}`}>
      {status === models.EnumActionStepStatus.Running ? (
        <Spin indicator={antIcon} />
      ) : (
        BuildStatusIcon({status})
      )}
    </span>
  );
};
