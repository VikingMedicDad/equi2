import { useCallback, useMemo, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import difference from "@extra-set/difference";
import { cloneDeep } from "lodash";

import * as models from "models";
import { GET_ENTITY_PERMISSIONS } from "@hooks/usePermissionsForm";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

export type Props = {
  entityId: string;
  actionDisplayName: string;
  permissionField: models.EntityPermissionField;
  onDeleteField: (fieldName: string) => void;
  permission: models.EntityPermission;
};

const useEntityPermissionField = ({
  entityId,
  actionDisplayName,
  permissionField,
  permission,
  onDeleteField,
}: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const availableRoles = useMemo((): models.AppRole[] => {
    if (!permission.permissionRoles) {
      return [];
    }

    return permission.permissionRoles.map((role) => role.appRole);
  }, [permission]);

  const selectedRoleIds = useMemo((): Set<string> => {
    return new Set(
      permissionField.permissionRoles?.map((item) => item.appRole.id)
    );
  }, [permissionField.permissionRoles]);

  /**@todo: handle  errors */
  const [updateRole] = useMutation(UPDATE_ROLES, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { updateEntityPermissionFieldRoles } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = cloneDeep(queryData.entity);

      const currentAction = clonedQueryData.permissions?.find(
        (p) => p.action === permission.action
      );

      if (!currentAction) {
        return;
      }

      const allOtherFields = currentAction.permissionFields?.filter(
        (item) => item.id !== permissionField.id
      );

      currentAction.permissionFields = [
        updateEntityPermissionFieldRoles,
      ].concat(allOtherFields);

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
        data: {
          entity: clonedQueryData,
        },
      });
    },
  });

  const handleDeleteField = useCallback(() => {
    onDeleteField(permissionField.fieldPermanentId);
  }, [onDeleteField, permissionField.fieldPermanentId]);

  const handleRoleSelectionChange = useCallback(
    (newSelectedRoleIds: Set<string>) => {
      const addedRoleIds = difference(newSelectedRoleIds, selectedRoleIds);
      const removedRoleIds = difference(selectedRoleIds, newSelectedRoleIds);

      const addPermissionRoles = Array.from(addedRoleIds, (id) => {
        const permissionRole = permission.permissionRoles?.find(
          (item) => item.appRoleId === id
        );
        return {
          id: permissionRole?.id,
        };
      });

      const deletePermissionRoles = Array.from(removedRoleIds, (id) => {
        const permissionRole = permission.permissionRoles?.find(
          (item) => item.appRoleId === id
        );
        return {
          id: permissionRole?.id,
        };
      });

      updateRole({
        variables: {
          permissionFieldId: permissionField.id,
          deletePermissionRoles: deletePermissionRoles,
          addPermissionRoles: addPermissionRoles,
        },
      }).catch(console.error);
    },
    [
      selectedRoleIds,
      permission.permissionRoles,
      permissionField.id,
      updateRole,
    ]
  );

  const result = {
    availableRoles,
    selectedRoleIds,
    handleRoleSelectionChange,
    handleDeleteField
  };

  return result;

};

export default useEntityPermissionField;


const UPDATE_ROLES = gql`
  mutation updateEntityPermissionFieldRoles(
    $permissionFieldId: String!
    $deletePermissionRoles: [WhereUniqueInput!]
    $addPermissionRoles: [WhereUniqueInput!]
  ) {
    updateEntityPermissionFieldRoles(
      data: {
        permissionField: { connect: { id: $permissionFieldId } }
        deletePermissionRoles: $deletePermissionRoles
        addPermissionRoles: $addPermissionRoles
      }
    ) {
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
`;
