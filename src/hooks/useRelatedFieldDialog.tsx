import { gql, useQuery } from "@apollo/client";
import {
  DialogProps,
} from "@amplication/design-system";
import { camelCase } from "camel-case";
import * as models from "models";

export type Values = {
  relatedFieldName: string;
  relatedFieldDisplayName: string;
};

export type Props = Omit<DialogProps, "title"> & {
  onSubmit: (data: Values) => void;
  relatedEntityId: string | undefined;
  allowMultipleSelection: boolean;
  entity: models.Entity;
};

const EMPTY_VALUES: Values = {
  relatedFieldName: "",
  relatedFieldDisplayName: "",
};

const useRelatedFieldDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
  entity,
  relatedEntityId,
  allowMultipleSelection,
}: Props) => {
  const { data, loading } = useQuery<{ entity: models.Entity }>(
    GET_RELATED_ENTITY_FIELDS,
    {
      variables: {
        entityId: relatedEntityId,
      },
      skip: !relatedEntityId,
    }
  );

  const valuesSuggestion = allowMultipleSelection
    ? {
        relatedFieldName: camelCase(entity.pluralDisplayName),
        relatedFieldDisplayName: entity.pluralDisplayName,
      }
    : {
        relatedFieldName: camelCase(entity.name),
        relatedFieldDisplayName: entity.displayName,
      };
  const initialValues: Values =
    data &&
    data.entity.fields &&
    data.entity.fields.every(
      (field) =>
        field.name !== valuesSuggestion.relatedFieldName &&
        field.displayName !== valuesSuggestion.relatedFieldDisplayName
    )
      ? valuesSuggestion
      : EMPTY_VALUES;

  
  const result = {
    initialValues,
    loading,
    data
  };

  return result;
};

export default useRelatedFieldDialog;

const GET_RELATED_ENTITY_FIELDS = gql`
  query getRelatedEntity($entityId: String!) {
    entity(where: { id: $entityId }) {
      name
      displayName
      fields {
        id
        name
      }
    }
  }
`;
