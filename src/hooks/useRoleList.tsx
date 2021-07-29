import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

type TData = {
  appRoles: models.AppRole[];
};

const DATE_CREATED_FIELD = "createdAt";

export type Props = {
  applicationId: string;
  selectFirst?: boolean;
};

const useRoleList = ({ applicationId, selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );
    const history = useHistory();

    const { data, loading, error } = useQuery<TData>(GET_ROLES, {
      variables: {
        id: applicationId,
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
        whereName:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
      },
    });

    const errorMessage = formatError(error);

    const handleRoleChange = useCallback(
      (role: models.AppRole) => {
        const fieldUrl = `/${applicationId}/roles/${role.id}`;
        history.push(fieldUrl);
      },
      [history, applicationId]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.appRoles)) {
        console.log("role list effect - inside");
        const role = data.appRoles[0];
        const fieldUrl = `/${applicationId}/roles/${role.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, applicationId, history]);

    const result = {
      loading,
      data,
      error,
      errorMessage,
      handleSearchChange,
      handleRoleChange
    };

    return result; 
};

export default useRoleList;

export const GET_ROLES = gql`
  query getRoles(
    $id: String!
    $orderBy: AppRoleOrderByInput
    $whereName: StringFilter
  ) {
    appRoles(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
    }
  }
`;
