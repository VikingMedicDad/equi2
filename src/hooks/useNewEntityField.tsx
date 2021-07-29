import { useCallback, useRef, useContext, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import { useTracking } from "util/analytics";

export type Props = {
  entity: models.Entity;
  onFieldAdd?: (field: models.EntityField) => void;
};

type TData = {
  createEntityFieldByDisplayName: models.EntityField;
};

const useNewEntityField = ({ entity, onFieldAdd }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const [createEntityField, { error, loading }] = useMutation<TData>(
    CREATE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;

        const newEntityField = data.createEntityFieldByDisplayName;

        if (newEntityField.dataType === models.EnumDataType.Lookup) {
          const relatedEntityId = newEntityField.properties.relatedEntityId;
          //remove the related entity from cache so it will be updated with the new relation field
          cache.evict({
            id: cache.identify({ id: relatedEntityId, __typename: "Entity" }),
          });
        }

        cache.modify({
          id: cache.identify(entity),
          fields: {
            fields(existingEntityFieldRefs = [], { readField }) {
              const newEntityFieldRef = cache.writeFragment({
                data: newEntityField,
                fragment: NEW_ENTITY_FIELD_FRAGMENT,
              });

              if (
                existingEntityFieldRefs.some(
                  (ref: Reference) => readField("id", ref) === newEntityField.id
                )
              ) {
                return existingEntityFieldRefs;
              }

              return [...existingEntityFieldRefs, newEntityFieldRef];
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity.id);
        trackEvent({
          eventName: "createEntityField",
          entityFieldName: data.createEntityFieldByDisplayName.displayName,
          dataType: data.createEntityFieldByDisplayName.dataType,
        });
      },
      errorPolicy: "none",
    }
  );

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(true);
      createEntityField({
        variables: {
          data: {
            displayName: data.displayName,
            entity: { connect: { id: entity.id } },
          },
        },
      })
        .then((result) => {
          if (onFieldAdd && result.data) {
            onFieldAdd(result.data.createEntityFieldByDisplayName);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createEntityField, entity.id, inputRef, onFieldAdd]
  );

  const errorMessage = formatError(error);

  const result = {
    loading,
    inputRef,
    autoFocus,
    error,
    errorMessage,
    handleSubmit
  };

  return result;
};

export default useNewEntityField;

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityFieldByDisplayName(
    $data: EntityFieldCreateByDisplayNameInput!
  ) {
    createEntityFieldByDisplayName(data: $data) {
      id
      displayName
      name
      dataType
      required
      searchable
      description
      properties
    }
  }
`;

const NEW_ENTITY_FIELD_FRAGMENT = gql`
  fragment NewEntityField on EntityField {
    id
    displayName
    name
    dataType
    required
    searchable
    description
    properties
  }
`;
