import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { Result, message, Badge, Avatar, Spin, Row, Col, List} from "antd";
import PendingChange from "@amp-components/VersionControl/PendingChange";
import Commit from "@amp-components/VersionControl/Commit";
import usePendingChanges, { Props } from "@hooks/usePendingChanges";
import { SmileOutlined, BranchesOutlined } from "@ant-design/icons";
import Flex from 'components/shared-components/Flex';

const CLASS_NAME = "pending-changes";

const PendingChanges = ({ applicationId }: Props) => {

  const {
    noChanges,
    data,
    loading,
    error,
    errorMessage,
  } = usePendingChanges({applicationId});

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <div className={CLASS_NAME}>
        <>
          {loading ? (
           <Spin />
          ) : (
            
              <Row>
                <Col span={8}>
                  {isEmpty(data?.pendingChanges) && !loading ? (
                    <Result
                      icon={<SmileOutlined />}
                      title="No pending changes! keep working!"
                    />
                  ):(
                    <>
                    <List
                      header={
                        <Row className={`${CLASS_NAME}__group-title`} align="middle">
                          <Col span={22}></Col>
                          <Col span={2}><Badge count={data?.pendingChanges.length} overflowCount={10}>
                            <Avatar shape="square" icon={<BranchesOutlined />} />
                            </Badge>
                          </Col>
                        </Row>
                      }
                      footer={
                        <div style={{marginBottom:'50px'}}></div>
                      }
                      
                      dataSource={data?.pendingChanges}
                      renderItem={item => (
                        <List.Item>
                          <PendingChange
                            key={item.resourceId}
                            change={item}
                            linkToResource={false}
                          />
                        </List.Item>
                      )}
                    />
                      <Flex flexDirection="row" justifyContent="end" alignItems="start">
                        <Badge color="#52c41a" text="Created" />&nbsp;&nbsp;
                        <Badge color="#108ee9" text="Updated" />&nbsp;&nbsp;
                        <Badge color="#eb2f96" text="Deleted" /> 
                      </Flex>
                    </>
                  )}
                </Col>
                <Col span={11} offset={3}>
                   <Commit
                    applicationId={applicationId} 
                    noChanges={noChanges} 
                  />
                </Col>
            </Row>
          )}
        </>
    </div>
  );
};

export default PendingChanges;