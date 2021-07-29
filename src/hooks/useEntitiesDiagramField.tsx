import { useCallback } from "react";
import * as models from "models";
import { FieldIdentifier } from "@hooks/useEntitiesDiagram";

type Props = {
  field: models.AppCreateWithEntitiesFieldInput;
  entityIndex: number;
  fieldIndex: number;
  editedFieldIdentifier: FieldIdentifier | null;
  onEdit: (fieldIdentifier: FieldIdentifier | null) => void;
};

const useEntitiesDiagramField = ({
    field,
    entityIndex,
    fieldIndex,
    editedFieldIdentifier,
    onEdit,
  }: Props) => {
    const dataType = field.dataType || models.EnumDataType.SingleLineText;

    const handleClick = useCallback(() => {
      onEdit && onEdit({ entityIndex, fieldIndex });
    }, [onEdit, entityIndex, fieldIndex]);

    const selected =
      editedFieldIdentifier &&
      editedFieldIdentifier.entityIndex === entityIndex &&
      editedFieldIdentifier.fieldIndex === fieldIndex;

    const handlers = {
      CLOSE_MODAL: () => {
        onEdit(null);
      },
    };
    
    const result = {
      selected,
      handlers,
      dataType,
      handleClick
    };

    return result;
};

export default useEntitiesDiagramField;