import React from "react";
import { LazyLog } from "react-lazylog";
import { isEmpty } from "lodash";
import * as models from "models";
import {Link} from 'react-router-dom';
import Timer from "@amp-components/Components/Timer";
import useActionLog, { Props } from "@hooks/useActionLog";
import { ProfileFilled, CheckCircleOutlined, CheckSquareTwoTone, CompassTwoTone, FieldTimeOutlined, WarningOutlined, LoadingOutlined} from '@ant-design/icons';
import { Tag, Row, Col, Typography } from "antd";
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import "./ActionLog.scss";

const { Text } = Typography;
const CLASS_NAME = "action-log";
const LOG_ROW_HEIGHT = 20;

export const BuildStatusIcon = (status: models.EnumActionStepStatus) => {
  switch(status){
    case (models.EnumActionStepStatus.Success):
      return <CheckSquareTwoTone twoToneColor="success"/>;
    case (models.EnumActionStepStatus.Failed):
      return <WarningOutlined twoToneColor="error"/>;
    case (models.EnumActionStepStatus.Waiting):
      return <FieldTimeOutlined />;
    default:
      return <></>;
  }
}

export const BuildStatusTag = (status: models.EnumActionStepStatus) => {
  switch(status){
    case (models.EnumActionStepStatus.Success):
      return  <Tag color="success"><CheckCircleOutlined /> Build status: {status}</Tag>;
    case (models.EnumActionStepStatus.Failed):
      return <Tag color="error"><WarningOutlined /> Build status:  {status}</Tag>;
    case (models.EnumActionStepStatus.Waiting):
      return <Tag color="processing"><FieldTimeOutlined />  Build status: {status} </Tag>;
    case (models.EnumActionStepStatus.Running):
      return <Tag color="processing"><LoadingOutlined  spin /> Build status:  {status} </Tag>; 

    default:
      return <></>;
  }
}

const ActionLog = ({ action, title, versionNumber, commitId }: Props) => {
  
  const {
    actionStatus,
    lastStepCompletedAt,
    logData
  } = useActionLog({
    action, title, versionNumber 
  }); 

  return (
    <div className={`${CLASS_NAME}`}>
      <Row className={`${CLASS_NAME}__header`}>
        {!action ? (
          <h4 style={{marginLeft:10}}>Action Log</h4>
        ) : (
          <>
          <Col>
            <h4 style={{marginLeft:10}}>
              <Tag color="default"> <ProfileFilled />&nbsp;  {title} <span>{versionNumber} </span></Tag>
              <Tag color="default"> <ProfileFilled />&nbsp;  Related commit <Link to={`${APP_PREFIX_PATH}/version/commits/${commitId}`} ><span> {commitId} </span></Link></Tag>
              {BuildStatusTag(actionStatus)}
            </h4>
          </Col>
          <Col span={3}>
            <Text type="secondary">
              Total duration{" "}
              <Timer
                startTime={action.createdAt}
                runTimer
                endTime={lastStepCompletedAt}
              />
            </Text>
          </Col>
          </>
        )}
      </Row>
      <div className={`${CLASS_NAME}__body`}>
        {logData.map((stepData) => (
          <div className={`${CLASS_NAME}__step h5`} key={stepData.id}>
            <div className={`${CLASS_NAME}__step__row`}>
              <span
                className={`${CLASS_NAME}__step__status ${CLASS_NAME}__step__status--${stepData.status.toLowerCase()}`}
              >
                {stepData.status === models.EnumActionStepStatus.Running ? (
                  <CompassTwoTone spin />
                ) : (
                  BuildStatusIcon(stepData.status)
                )}
              </span>
              <span className={`${CLASS_NAME}__step__message`}>
                {stepData.message}
              </span>
              <span className={`${CLASS_NAME}__step__duration`}>
                {stepData.duration}
              </span>
            </div>
            {!isEmpty(stepData.messages) && (
              <div className={`${CLASS_NAME}__step__log`}>
                <LazyLog
                  rowHeight={LOG_ROW_HEIGHT}
                  lineClassName={`${CLASS_NAME}__line`}
                  extraLines={0}
                  enableSearch={false}
                  selectableLines={false}
                  text={stepData.messages}
                  
                  height={10} //we use a random value in order to disable the auto-sizing, and use "height:auto !important" in CSS
                />
              </div>
            )}
          </div>
        ))}

        {isEmpty(logData) && (
          <div className={`${CLASS_NAME}__empty-state`}>
            <div className={`${CLASS_NAME}__empty-state__title`}>
              Create or select an action to view the log
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionLog;
