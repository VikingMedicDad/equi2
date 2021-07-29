import { useCallback, useMemo, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { remove, cloneDeep } from "lodash";

import { GET_ENTITY_PERMISSIONS } from "@hooks/usePermissionsForm";
import { GET_FIELDS } from "@hooks/useEntityFieldList";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

type TData = {
  entity: models.Entity;
};

export type Props = {
  actionName: models.EnumEntityAction;
  actionDisplayName: string;
  entityId: string;
  permission: models.EntityPermission;
};

const useEntityPermissionFields = ({
  actionName,
  actionDisplayName,
  entityId,
  permission,
}: Props) => {
  
  const pendingChangesContext = useContext(PendingChangesContext);

  const selectedFieldIds = useMemo((): Set<string> => {
    return new Set(permission.permissionFields?.map((field) => field.field.id));
  }, [permission.permissionFields]);

  const { data } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
      orderBy: undefined /**@todo: implement orderBy position */,
      whereName: undefined,
    },
  });

  /**@todo: handle  errors */
  const [addField] = useMutation(ADD_FIELD, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { addEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = {
        entity: cloneDeep(queryData.entity),
      };

      const actionData = clonedQueryData.entity.permissions?.find(
        (p) => p.action === actionName
      );
      if (!actionData) {
        return;
      }

      actionData.permissionFields = actionData?.permissionFields?.concat([
        addEntityPermissionField,
      ]);

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
        data: {
          entity: {
            ...clonedQueryData.entity,
          },
        },
      });
    },
  });

  /**@todo: handle  errors */
  const [deleteField] = useMutation(DELETE_FIELD, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { deleteEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = {
        entity: cloneDeep(queryData.entity),
      };

      const actionData = clonedQueryData.entity.permissions?.find(
        (p) => p.action === actionName
      );
      if (!actionData || !actionData.permissionFields) {
        return;
      }

      remove(
        actionData.permissionFields,
        (field) =>
          field.fieldPermanentId ===
          deleteEntityPermissionField.fieldPermanentId
      );

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
        data: {
          entity: {
            ...clonedQueryData.entity,
          },
        },
      });
    },
  });

  const handleFieldSelected = useCallback(
    ({ fieldName }) => {
      addField({
        variables: {
          fieldName: fieldName,
          entityId: entityId,
          action: actionName,
        },
      }).catch(console.error);
    },
    [addField, entityId, actionName]
  );

  const handleDeleteField = useCallback(
    (fieldPermanentId) => {
      deleteField({
        variables: {
          fieldPermanentId: fieldPermanentId,
          entityId: entityId,
          action: actionName,
        },
      }).catch(console.error);
    },
    [deleteField, entityId, actionName]
  );

  const result = {
    data,
    selectedFieldIds,
    handleFieldSelected,
    handleDeleteField
  };
  
  return result;

};

const ADD_FIELD = gql`
  mutation addEntityPermissionField(
    $fieldName: String!
    $entityId: String!
    $action: EnumEntityAction!
  ) {
    addEntityPermissionField(
      data: {
        action: $action
        fieldName: $fieldName
        entity: { connect: { id: $entityId } }
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

export default useEntityPermissionFields;

const DELETE_FIELD = gql`
  mutation deleteEntityPermissionField(
    $fieldPermanentId: String!
    $entityId: String!
    $action: EnumEntityAction!
  ) {
    deleteEntityPermissionField(
      where: {
        action: $action
        fieldPermanentId: $fieldPermanentId
        entityId: $entityId
      }
    ) {
      id
      fieldPermanentId
    }
  }
`;
