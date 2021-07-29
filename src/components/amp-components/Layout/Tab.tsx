import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
// import { Button, EnumButtonStyle } from "../Components/Button";

import "./NavigationTabs.scss";
import useTab, { TabProps } from "@hooks/useTab";

const CLASS_NAME = "navigation-tabs";

const Tab = ({ item, defaultTabUrl, tabsCount }: TabProps) => {
  
  const {
    activeClass,
    handleCloseTab
  } = useTab({
    item, 
    defaultTabUrl,
    tabsCount
  });

  return (
    <span
      className={classNames(`${CLASS_NAME}__tab`, {
        [activeClass]: item.active,
      })}
    >
      <Link to={item.url}>{item.name}</Link>
      x
      {/* <Button
        disabled={item.url === defaultTabUrl && tabsCount === 1}
        buttonStyle={EnumButtonStyle.Clear}
        icon="close"
        onClick={handleCloseTab}
      /> */}
    </span>
  );
};

export default Tab;
