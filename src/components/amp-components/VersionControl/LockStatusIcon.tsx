import React from "react";
import { Tooltip, Row } from "antd";
import * as models from "models";
import { LockTwoTone } from '@ant-design/icons';


type Props = {
  lockedByUser: models.User;

  longVersion: boolean;
};

function LockStatusIcon({ lockedByUser, longVersion}: Props) {
  return (
    <>
      {
				longVersion ?
				(
					<Row>
            <Tooltip title={`Locked by ${lockedByUser.account?.firstName} ${lockedByUser.account?.lastName}`}>
              <LockTwoTone twoToneColor="#eb2f96"/><span>{` Locked by ${lockedByUser.account?.firstName} ${lockedByUser.account?.lastName}`}</span>
            </Tooltip>
          </Row>
				):
				(
					<Tooltip title={`Locked by ${lockedByUser.account?.firstName} ${lockedByUser.account?.lastName}`}>
            <LockTwoTone twoToneColor="#eb2f96"/>
          </Tooltip>
				)
			}
		</>
  );
}
export default LockStatusIcon;
