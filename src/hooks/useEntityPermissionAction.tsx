import { useCallback, useMemo, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { isEmpty, cloneDeep } from "lodash";
import difference from "@extra-set/difference";

import "./EntityPermissionAction.scss";
import * as models from "models";
import * as permissionTypes from "@amp-components/Permissions/types";

import { GET_ENTITY_PERMISSIONS } from "@hooks/usePermissionsForm";
import { GET_ROLES } from "@hooks/useRoleList";

import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

type TData = {
  appRoles: models.AppRole[];
};

export type Props = {
  entityId: string;
  permission: models.EntityPermission;
  permissionAction: permissionTypes.PermissionAction;
  entityDisplayName: string;
  applicationId: string;
};

const useEntityPermissionAction = ({
  entityId,
  permission,
  permissionAction: { action: actionName, actionDisplayName, canSetFields },
  entityDisplayName,
  applicationId,
}: Props) => {

  const pendingChangesContext = useContext(PendingChangesContext);

  const selectedRoleIds = useMemo((): Set<string> => {
    return new Set(permission.permissionRoles?.map((role) => role.appRoleId));
  }, [permission.permissionRoles]);

  /**@todo: handle  errors */
  const [updatePermission] = useMutation(UPDATE_PERMISSION, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
  });

  /**@todo: handle  errors */
  const [updateRole] = useMutation(UPDATE_ROLES, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { updateEntityPermissionRoles } }) {
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

      const allOtherActions = clonedQueryData.permissions?.filter(
        (p) => p.action !== actionName
      );

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
        data: {
          entity: {
            ...clonedQueryData,
            permissions: allOtherActions?.concat([updateEntityPermissionRoles]),
          },
        },
      });
    },
  });

  const handleRoleSelectionChange = useCallback(
    (newSelectedRoleIds: Set<string>) => {
      const addedRoleIds = difference(newSelectedRoleIds, selectedRoleIds);
      const removedRoleIds = difference(selectedRoleIds, newSelectedRoleIds);

      const addRoles = Array.from(addedRoleIds, (id) => ({
        id,
      }));

      const deleteRoles = Array.from(removedRoleIds, (id) => ({
        id,
      }));

      updateRole({
        variables: {
          entityId: entityId,
          action: actionName,
          deleteRoles: deleteRoles,
          addRoles: addRoles,
        },
      }).catch(console.error);
    },
    [selectedRoleIds, actionName, entityId, updateRole]
  );

  /**@todo: handle loading state and errors */
  const { data } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: applicationId,
      orderBy: undefined,
      whereName: undefined,
    },
  });

  const handleChangeType = useCallback(
    (type) => {
      updatePermission({
        variables: {
          data: {
            action: actionName,
            type: type,
          },
          where: {
            id: entityId,
          },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateEntityPermission: {
            id: permission.id,
            __typename: "EntityPermission",
            type: type,
            action: actionName,
          },
        },
      }).catch(console.error);
    },
    [updatePermission, entityId, actionName, permission.id]
  );

  const handleDisableChange = useCallback(
    (checked: boolean) => {
      const type = checked
        ? models.EnumEntityPermissionType.AllRoles
        : models.EnumEntityPermissionType.Disabled;
      updatePermission({
        variables: {
          data: {
            action: actionName,
            type: type,
          },
          where: {
            id: entityId,
          },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateEntityPermission: {
            id: permission.id,
            __typename: "EntityPermission",
            type: type,
            action: actionName,
          },
        },

        refetchQueries: () => {
          /**Refetch all the entity's permissions only when saving the action for the first time (permission.id is empty) */
          if (isEmpty(permission.id)) {
            return [
              {
                query: GET_ENTITY_PERMISSIONS,
                variables: { id: entityId },
              },
            ];
          } else {
            return [];
          }
        },
      }).catch(console.error);
    },
    [updatePermission, entityId, actionName, permission.id]
  );
  const isOpen = permission.type === models.EnumEntityPermissionType.Granular;

  const result = {
    isOpen,
    data,
    models,
    selectedRoleIds,
    handleChangeType,
    handleDisableChange,
    handleRoleSelectionChange
  };

  return result;
};

export default useEntityPermissionAction;

const UPDATE_PERMISSION = gql`
  mutation updateEntityPermission(
    $data: EntityUpdatePermissionInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityPermission(data: $data, where: $where) {
      id
      action
      type
    }
  }
`;

const UPDATE_ROLES = gql`
  mutation updateEntityPermissionRoles(
    $entityId: String!
    $action: EnumEntityAction!
    $deleteRoles: [WhereUniqueInput!]
    $addRoles: [WhereUniqueInput!]
  ) {
    updateEntityPermissionRoles(
      data: {
        action: $action
        entity: { connect: { id: $entityId } }
        deleteRoles: $deleteRoles
        addRoles: $addRoles
      }
    ) {
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
      }
    }
  }
`;
