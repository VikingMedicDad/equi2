import React, { useContext } from "react";
import NavigationTabsContext from "./NavigationTabsContext";
import Tab from "./Tab";
import "./NavigationTabs.scss";

const CLASS_NAME = "navigation-tabs";

type Props = {
  defaultTabUrl: string;
};

const NavigationTabs = ({ defaultTabUrl }: Props) => {
  const navigationTabsContext = useContext(NavigationTabsContext);

  return (
    <div className={CLASS_NAME}>
      {navigationTabsContext.items.map((item, index, items) => (
        <NavigationTabs.Tab
          key={index}
          item={item}
          defaultTabUrl={defaultTabUrl}
          tabsCount={items.length}
        />
      ))}
    </div>
  );
};

NavigationTabs.Tab = Tab;

export default NavigationTabs;
