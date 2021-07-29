import classNames from "classnames";
import React from "react";
import useApplicationSelectorListItem, { Props } from "@hooks/useApplicationSelectorListItem";
import { Button } from "antd";
import { AppstoreOutlined } from '@ant-design/icons';


const CLASS_NAME = "applications-selector__list__item";

function ApplicationSelectorListItem({
  application,
  selected,
  onApplicationSelected,
}: Props) {
  
  const { handleClick } = useApplicationSelectorListItem({
    application,
    selected,
    onApplicationSelected
  });

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}--active`]: selected,
      })}
      onClick={handleClick}
    >
      <Button className={`${CLASS_NAME}__name`} type="dashed" block><AppstoreOutlined />{application?.app.name}</Button>
    </div>
  );
}

export default ApplicationSelectorListItem;
