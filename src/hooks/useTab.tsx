import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import NavigationTabsContext, {
  NavigationTabItem,
} from "@amp-components/Layout/NavigationTabsContext";

//Main component is Navigation Tab
const CLASS_NAME = "navigation-tabs";

export type TabProps = {
  item: NavigationTabItem;
  defaultTabUrl: string;
  tabsCount: number;
};

const useTab = ({ item, defaultTabUrl, tabsCount }: TabProps) => {
  const history = useHistory();
  const navigationTabsContext = useContext(NavigationTabsContext);
  const handleCloseTab = useCallback(() => {
    const url = navigationTabsContext.unregisterItem(item.key);
    history.push(url || defaultTabUrl);
  }, [navigationTabsContext, item.key, history, defaultTabUrl]);

  const activeClass = `${CLASS_NAME}__tab--active`;

  const result = {
    activeClass,
    handleCloseTab
  };

  return result;
};

export default useTab;
