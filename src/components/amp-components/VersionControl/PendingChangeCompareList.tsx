import React, { useEffect } from "react";
import { Collapse, message} from 'antd';
import PendingChange from "@amp-components/VersionControl/PendingChange";
import PendingChangeDiff from "@amp-components/VersionControl/PendingChangeDiff";
import usePendingChanges from "@hooks/usePendingChanges";
import { EnumCompareType } from "@hooks/usePendingChangeDiff";

type Props = {
  applicationId: string;
  splitView: boolean;
};

const CLASS_NAME = "pending-change-with-compare";
const { Panel } = Collapse;

const PendingChangeCompareList = ({ applicationId,
                                    splitView }: Props) => {

  const {
    data,
    error,
    errorMessage
  } = usePendingChanges({applicationId});

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <>
      <Collapse bordered={false} defaultActiveKey={data?.pendingChanges[0]?.resourceId}>
        {data?.pendingChanges.map((change) => (
          <Panel  
              className={CLASS_NAME} 
              header={
                <PendingChange change={change} />
              } 
              key={change.resourceId}
          >
            <PendingChangeDiff
              key={change.resourceId}
              change={change}
              compareType={EnumCompareType.Pending}
              splitView={splitView}
            />
          </Panel>
        ))}
      </Collapse>
    </>
   
  );
};

export default PendingChangeCompareList;
