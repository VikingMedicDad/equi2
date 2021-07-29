import { useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Props } from "@hooks/useApplicationListItem";
import * as models from "models";
import { useHistory } from "react-router-dom";


export const CURRENT_APPLICATION = 'currentApplication';
const DEFAULT_REDIRECTION = "/app/workspaces"

function useApplicationSelector(redirection?:string) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const history = useHistory();

  const handleSetCurrentApplication = useCallback((application: Props) => {
      setIsOpen(false);
      setLSCurrentApplication(application.app.id);
      history.replace(redirection?redirection:DEFAULT_REDIRECTION);
      window.location.reload();
    },
    [ history, redirection]
  );

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  const { data, loading, error } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: getLSCurrentApplication(),
    },
  });

  const result = {
    loading,
    isOpen,
    data,
    error,
    handleSetCurrentApplication,
    handleOpen
  };
  
  return result;

}

export default useApplicationSelector;

const setLSCurrentApplication = (applicationId: string) => {
  localStorage.setItem(CURRENT_APPLICATION, applicationId);
}

export const getLSCurrentApplication = () => {
  return localStorage.getItem(CURRENT_APPLICATION) || null;
}

export const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      name
      description
    }
  }
`;
