import { useCallback } from "react";
import * as models from "models";
import { useHistory } from "react-router-dom";

export type Props = {
  applicationId: string;
  entity: models.Entity;
  entityField: models.EntityField;
  entityIdToName: Record<string, string> | null;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const useEntityFieldListItem = ({
  entityField,
  entity,
  applicationId,
  entityIdToName,
  onDelete,
  onError,
}: Props) => {
  const history = useHistory();

  const handleNavigateToRelatedEntity = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      history.push(
        `/${applicationId}/entities/${entityField.properties.relatedEntityId}`
      );
    },
    [history, applicationId, entityField]
  );

  const handleRowClick = useCallback(() => {
    history.push(
      `/${applicationId}/entities/${entity.id}/fields/${entityField.id}`
    );
  }, [history, applicationId, entityField, entity]);

  const fieldUrl = `/${applicationId}/entities/${entity.id}/fields/${entityField.id}`;

  const result = {
    fieldUrl,
    handleNavigateToRelatedEntity,
    handleRowClick
  };

  return result;
};

export default useEntityFieldListItem;