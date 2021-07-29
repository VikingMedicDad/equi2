import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

export type Props = {
  /**The content of the header, to be placed within a <h3> element */
  children: React.ReactNode;
  /**Whether to show a back button in the header of the sidebar */
  showBack?: boolean;
  /**The URL to navigate to when the user clicks on the back button. When empty history.goBack is used  */
  backUrl?: string;
};

const keyMap = {
  SUBMIT: ["CLOSE_SIDEBAR", "esc"],
};

const useSidebarHeader = ({ children, showBack, backUrl }: Props) => {
  const history = useHistory();

  const goBack = useCallback(() => {
    if (backUrl) {
      history.push(backUrl);
    } else {
      history.goBack();
    }
  }, [history, backUrl]);

  const handlers = {
    SUBMIT: goBack,
  };

  const result = {
    keyMap,
    handlers,
    goBack
  };

  return result;
};

export default useSidebarHeader;
