import * as models from "models";

export type Props = {
  field: models.AppCreateWithEntitiesFieldInput;
};

const useEntitiesDiagramStaticField = ({ field }: Props) => {
  const dataType = field.dataType || models.EnumDataType.SingleLineText;

  const result = {
    dataType
  };

  return result;
};

export default useEntitiesDiagramStaticField;