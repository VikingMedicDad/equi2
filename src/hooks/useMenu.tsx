import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { unsetToken } from "authentication/authentication";

export type MenuProps = {
  children?: React.ReactNode;
};

const useMenu = () => {
  const history = useHistory();
  const apolloClient = useApolloClient();

  const handleSignOut = useCallback(() => {
    console.log("Calling handle Signout");
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/");
  }, [history, apolloClient]);

  
  const result = {
    handleSignOut
  };

  return result;
};

export default useMenu;