import React, { useEffect , useMemo} from "react";
import { Collapse, message, Spin, Empty} from 'antd';
import PendingChange from "@amp-components/VersionControl/PendingChange";
import PendingChangeDiff from "@amp-components/VersionControl/PendingChangeDiff";
import { EnumCompareType } from "@hooks/usePendingChangeDiff";
import useCommitPage from "@hooks/useCommitPage";

type Props = {
  commitId: string;
  splitView: boolean;
};

const CLASS_NAME = "pending-change-with-compare";
const { Panel } = Collapse;

const CommitCompareList = ({  commitId,
                              splitView }: Props) => 
{
  const {
    data,
    loading,
    error,
    errorMessage,
  } = useCommitPage({commitId});

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
  }, [error, errorMessage]);


  const memoPendingChanges = useMemo (() => {    
    if (!data?.commit.changes) 
        return [];
    return data?.commit.changes;
  }, [data]);

  let pendingChanges:any[] = [];

  if(data?.commit.changes){
    pendingChanges = memoPendingChanges;
  } 

  return (
    <>
      {loading ? (<Spin />):(
        <Collapse bordered={false}  defaultActiveKey={pendingChanges[0] ? pendingChanges[0].ressourceId : ['1']}>
          {pendingChanges.map((change) => (
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
      )}
      {
        pendingChanges.length === 0 && (
          <Empty 
            description={
                <span>
                    No file changed on this commit. <p>This is an automated generated commit from build pipeline</p>
                </span>
            }
        />
        )
      }
    </>
   
  );
};

export default CommitCompareList;
