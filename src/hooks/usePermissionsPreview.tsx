import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";

import * as models from "models";
import * as permissionsTypes from "@amp-components/Permissions/types";
import { preparePermissionsByAction } from "@amp-components/Permissions/permissionUtil";

type TData = {
  entity: models.Entity;
};

type Props = {
  entityId?: string;
  availableActions: permissionsTypes.PermissionAction[];
  entityDisplayName: string;
};

function usePermissionsPreview({
  entityId,
  availableActions,
  entityDisplayName,
}: Props) {
  entityDisplayName;

  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PERMISSIONS, {
    variables: {
      id: entityId,
    },
  });
  const errorMessage = formatError(error);

  const permissionsByAction = useMemo(() => {
    return preparePermissionsByAction(
      availableActions,
      data?.entity.permissions
    );
  }, [data, availableActions]);

  const result = {
    error,
    errorMessage,
    loading,
    permissionsByAction
  };
  
  return result;
}

export default usePermissionsPreview;

export const GET_ENTITY_PERMISSIONS = gql`
  query getEntityPermissionsPreview($id: String!) {
    entity(where: { id: $id }) {
      id
      permissions {
        id
        action
        type
        permissionRoles {
          id
          appRoleId
        }
      }
    }
  }
`;
