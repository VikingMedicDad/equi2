import React from "react";
import * as models from "models";
import useApiTokenListItem from "@hooks/useApiTokenListItem";
import { Descriptions, Typography, Tag } from 'antd';
import { CalendarTwoTone } from "@ant-design/icons";
import utils from 'utils';
import DeleteApiToken from "./delete";


type Props = {
  applicationId: string;
  apiToken: models.ApiToken;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const { Text } = Typography;

const ApiTokenListItem = ({
  apiToken,
  onDelete,
  onError,
}: Props) => {
  
  const  {
    newToken,
    createdDate,
    expirationDate
  } = useApiTokenListItem({apiToken});

  return (
    <>

      <Descriptions
        // bordered
        size="small"
        layout="vertical"
        column={3}
        colon
        className="my-3"
        title={apiToken.name}
      >
          <Descriptions.Item label={
              <>
               <CalendarTwoTone />&nbsp;
                Created date
              </>
            } 
            span={1}>
           <Tag color="blue">{utils.formatTimeToNow(createdDate)}</Tag>
          </Descriptions.Item>
         
          <Descriptions.Item label={
              <>
               <CalendarTwoTone />&nbsp;
                Expired date
              </>
            }  span={1}>
            <Tag color="geekblue">{utils.formatTimeToNow(expirationDate)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={
              <>
                Remove token
              </>
            } 
            span={1}>
               <DeleteApiToken
                    apiToken={apiToken}
                    onDelete={onDelete}
                    onError={onError}
                /> 
          </Descriptions.Item>
          <Descriptions.Item label="Token Value" span={3}>
            {!newToken?
                (<Tag color="default"><Text type="secondary" style={{fontSize:8.5}}><b>*************************************************************************************************************************************************************{apiToken.previewChars}</b></Text></Tag>):
                (<Tag color="magenta"><Text  style={{fontSize:8.5}}><b>{apiToken.token}</b></Text></Tag>)
            }
          </Descriptions.Item>
          
      </Descriptions>
    </>
  );
};

export default ApiTokenListItem;