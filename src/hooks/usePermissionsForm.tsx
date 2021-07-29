import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

import { formatError } from "util/error";
import * as models from "models";
import { preparePermissionsByAction } from "@amp-components/Permissions/permissionUtil";

import * as permissionsTypes from "@amp-components/Permissions/types";

type TData = {
  entity: models.Entity;
};

export type Props = {
  availableActions: permissionsTypes.PermissionAction[];
  applicationId: string;
  entityId: string;
  objectDisplayName: string;
};

const usePermissionsForm = ({
  availableActions,
  applicationId,
  entityId,
  objectDisplayName
}: Props) => {

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
    loading,
    error,
    errorMessage,
    permissionsByAction
  };

  return result;

};

export default usePermissionsForm;

export const GET_ENTITY_PERMISSIONS = gql`
  query getEntityPermissions($id: String!) {
    entity(where: { id: $id }) {
      id
      permissions {
        id
        action
        type
        permissionRoles {
          id
          appRoleId
          appRole {
            id
            displayName
          }
        }
        permissionFields {
          id
          fieldPermanentId
          field {
            id
            name
            displayName
          }
          permissionRoles {
            id
            appRole {
              id
              displayName
            }
          }
        }
      }
    }
  }
`;
