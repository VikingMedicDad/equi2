import { gql, useQuery } from "@apollo/client";
import * as models from "models";

type TData = {
  workspaces: models.Workspace[];
};

function useWorkspaceSelectorList() {
  const { data, loading } = useQuery<TData>(GET_WORKSPACES);
  
  const result = {
    loading,
    data,
  };

  return result;
}

export default useWorkspaceSelectorList;

const GET_WORKSPACES = gql`
  query getWorkspaces {
    workspaces {
      id
      name
    }
  }
`;
