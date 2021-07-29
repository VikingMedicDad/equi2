import { useCallback, useContext, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "models";
import { useHistory } from "react-router-dom";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

type DType = {
  deleteEntity: { id: string };
};

export type Props = {
  applicationId: string;
  entity: models.Entity;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const useEntityListItem = ({
  entity,
  applicationId,
  onDelete,
  onError,
}: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);
  const history = useHistory();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteEntity, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedEntityId = data.deleteEntity.id;

        cache.modify({
          fields: {
            entities(existingEntityRefs, { readField }) {
              return existingEntityRefs.filter(
                (entityRef: Reference) =>
                  deletedEntityId !== readField("id", entityRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(data.deleteEntity.id);
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
    deleteEntity({
      variables: {
        entityId: entity.id,
      },
    }).catch(onError);
  }, [entity, deleteEntity, onError]);

  const handleRowClick = useCallback(() => {
    history.push(`/${applicationId}/entities/${entity.id}`);
  }, [history, applicationId, entity]);

  const [latestVersion] = entity.versions;

  const result = {
    deleteLoading,
    latestVersion,
    confirmDelete,
    handleRowClick,
    handleConfirmDelete,
    handleDismissDelete,
    handleDelete
  };

  return result; 

};

export default useEntityListItem;

const DELETE_ENTITY = gql`
  mutation deleteEntity($entityId: String!) {
    deleteEntity(where: { id: $entityId }) {
      id
    }
  }
`;
