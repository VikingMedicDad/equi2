import React from "react";
import { DeleteTwoTone, DiffTwoTone, EditTwoTone } from "@ant-design/icons";
import * as models from "models";
import Flex from 'components/shared-components/Flex';

type Props = {
  change: models.PendingChange;
  linkToResource?: boolean;
};

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: React.ReactNode;
} = {
  [models.EnumPendingChangeAction.Create]: <DiffTwoTone className="h4 mb-0 "    twoToneColor="#52c41a" />,
  [models.EnumPendingChangeAction.Delete]: <DeleteTwoTone className="h4 mb-0 "  twoToneColor="#eb2f96"/>,
  [models.EnumPendingChangeAction.Update]: <EditTwoTone className="h4 mb-0 "    twoToneColor="#108ee9" />,
};

const PendingChange = ({
  change,
  linkToResource = false,
}: Props) => {
  return (
    <Flex justifyContent="between" alignItems="center" className="w-100">
      <div className="d-flex align-items-center">
        {ACTION_TO_LABEL[change.action]}
        <div className="ml-3">
          <h4 className="mb-0">{change.resource.displayName}</h4>
        </div>
      </div>
    </Flex>
  );
};

export default PendingChange;
