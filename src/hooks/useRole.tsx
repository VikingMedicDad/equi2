import { useCallback } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

type TData = {
  appRole: models.AppRole;
};

const useRole = () => {
  const match = useRouteMatch<{
    application: string;
    roleId: string;
  }>("/:application/roles/:roleId");

  const { roleId } = match?.params ?? {};

  const { data, error, loading } = useQuery<TData>(GET_ROLE, {
    variables: {
      roleId,
    },
  });

  const [updateRole, { error: updateError }] = useMutation(UPDATE_ROLE);

  const handleSubmit = useCallback(
    (data) => {
      updateRole({
        variables: {
          where: {
            id: roleId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateRole, roleId]
  );

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  const result = {
    loading,
    data,
    hasError,
    errorMessage,
    handleSubmit
  };

  return result; 
};

export default useRole;

const GET_ROLE = gql`
  query getAppRole($roleId: String!) {
    appRole(where: { id: $roleId }) {
      id
      name
      displayName
      description
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation updateAppRole(
    $data: AppRoleUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateAppRole(data: $data, where: $where) {
      id
      name
      displayName
      description
    }
  }
`;
