import { useCallback, useState, useContext } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

type DType = {
  deleteEntityField: { id: string };
};

export type Props = {
  entityId: string;
  entityField: models.EntityField;
  showLabel?: boolean;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const useDeleteEntityField = ({
  entityField,
  entityId,
  showLabel = false,
  onDelete,
  onError,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const pendingChangesContext = useContext(PendingChangesContext);

  const [deleteEntityField, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedFieldId = data.deleteEntityField.id;

        if (entityField.dataType === models.EnumDataType.Lookup) {
          const relatedEntityId = entityField.properties.relatedEntityId;
          cache.evict({
            id: cache.identify({ id: relatedEntityId, __typename: "Entity" }),
          });
        }

        cache.modify({
          id: cache.identify({ id: entityId, __typename: "Entity" }),
          fields: {
            fields(existingFieldsRefs, { readField }) {
              return existingFieldsRefs.filter(
                (fieldRef: Reference) =>
                  deletedFieldId !== readField("id", fieldRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entityId);
        onDelete && onDelete();
      },
    }
  );

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteEntityField({
      variables: {
        entityFieldId: entityField.id,
      },
    }).catch(onError);
  }, [entityField, deleteEntityField, onError]);

  const result = { 
    confirmDelete,
    deleteLoading,
    handleConfirmDelete,
    handleDismissDelete,
    handleDelete
  };

  return result;
};

export default useDeleteEntityField;

const DELETE_ENTITY_FIELD = gql`
  mutation deleteEntityField($entityFieldId: String!) {
    deleteEntityField(where: { id: $entityFieldId }) {
      id
    }
  }
`;
