import { useCallback } from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
import * as models from "models";
import {
  EntityPositionData,
  FieldIdentifier,
} from "@hooks/useEntitiesDiagram";

export type Props = {
  entity: models.AppCreateWithEntitiesEntityInput;
  entityIndex: number;
  editedFieldIdentifier: FieldIdentifier | null;
  editedEntity: number | null;
  positionData: EntityPositionData;
  zoomLevel: number;
  onDrag?: (entityIndex: number, data: DraggableData) => void;
  onEditField: (fieldIdentifier: FieldIdentifier | null) => void;
  onEditEntity: (entityIndex: number | null) => void;
  onDeleteEntity: (entityIndex: number) => void;
  onAddEntity: (entityIndex: number) => void;
};

const useEntitiesDiagramEntity = ({
  entity,
  entityIndex,
  editedEntity,
  positionData,
  zoomLevel,
  onDrag,
  onEditEntity,
  onDeleteEntity,
  onAddEntity
} : Props) => {

  const handleAddEntity = useCallback(() => {
    onAddEntity && onAddEntity(entityIndex);
  }, [entityIndex, onAddEntity]);

  const handleDeleteEntity = useCallback(() => {
    onDeleteEntity && onDeleteEntity(entityIndex);
  }, [entityIndex, onDeleteEntity]);

  const handleDrag = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      onDrag && onDrag(entityIndex, data);
    },
    [onDrag, entityIndex]
  );

  const handleEditEntity = useCallback(() => {
    onEditEntity && onEditEntity(entityIndex);
  }, [onEditEntity, entityIndex]);

  const selected = entityIndex === editedEntity;

  const handlers = {
    CLOSE_MODAL: () => {
      onEditEntity(null);
    },
  };

  const result = {
    entityIndex,
    positionData,
    handlers,
    selected,
    entity,
    zoomLevel,
    handleDrag,
    handleDeleteEntity,
    handleEditEntity,
    handleAddEntity
  };
  return result;
};

export default useEntitiesDiagramEntity;
