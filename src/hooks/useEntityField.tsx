import { useCallback, useMemo, useContext, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { types } from "@amplication/data";

import { formatError } from "util/error";
import * as models from "models";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";

import { useTracking } from "util/analytics";
import { Values } from "./EntityFieldForm";
import {
  Values as RelatedFieldValues,
} from "./RelatedFieldDialog";

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntityField: models.EntityField;
};

const useEntityField = () => {
  const { trackEvent } = useTracking();
  const [lookupPendingData, setLookupPendingData] = useState<Values | null>(
    null
  );
  const pendingChangesContext = useContext(PendingChangesContext);
  const history = useHistory();
  const [error, setError] = useState<Error>();

  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");

  const { application, entity, field } = match?.params ?? {};

  if (!application) {
    throw new Error("application parameters is required in the query string");
  }

  const { data, error: loadingError, loading } = useQuery<TData>(
    GET_ENTITY_FIELD,
    {
      variables: {
        entity,
        field,
      },
    }
  );

  const entityField = data?.entity.fields?.[0];
  const entityDisplayName = data?.entity.displayName;

  const [updateEntityField, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;

        const updatedField = data.updateEntityField;

        if (updatedField.dataType === models.EnumDataType.Lookup) {
          const relatedEntityId = updatedField.properties.relatedEntityId;
          //remove the related entity from cache so it will be updated with the new relation field
          cache.evict({
            id: cache.identify({
              id: relatedEntityId,
              __typename: "Entity",
            }),
          });
        }
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity);
        trackEvent({
          eventName: "updateEntityField",
          entityFieldName: data.updateEntityField.displayName,
          dataType: data.updateEntityField.dataType,
        });
      },
    }
  );

  const handleDeleteField = useCallback(() => {
    history.push(`/${application}/entities/${entity}/fields/`);
  }, [history, application, entity]);

  const handleSubmit = useCallback(
    (data) => {
      if (data.dataType === models.EnumDataType.Lookup) {
        const properties = data.properties as types.Lookup;
        if (
          entityField?.dataType !== models.EnumDataType.Lookup ||
          properties.relatedEntityId !== entityField?.properties.relatedEntityId
        ) {
          setLookupPendingData(data);
          return;
        }
      }

      const { id, ...rest } = data; // eslint-disable-line @typescript-eslint/no-unused-vars
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data: rest,
        },
      }).catch(console.error);
    },
    [updateEntityField, field, entityField]
  );

  const handleRelatedFieldFormSubmit = useCallback(
    (relatedFieldValues: RelatedFieldValues) => {
      if (!lookupPendingData) {
        throw new Error("lookupPendingData must be defined");
      }
      const { id, ...rest } = lookupPendingData; // eslint-disable-line @typescript-eslint/no-unused-vars
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data: {
            ...rest,
            properties: {
              ...lookupPendingData.properties,
              relatedFieldId: undefined,
            },
          },
          ...relatedFieldValues,
        },
      }).catch(console.error);
      setLookupPendingData(null);
    },
    [updateEntityField, lookupPendingData, field]
  );

  const hideRelatedFieldDialog = useCallback(() => {
    setLookupPendingData(null);
  }, [setLookupPendingData]);

  const hasError =
    Boolean(error) || Boolean(updateError) || Boolean(loadingError);
  const errorMessage =
    formatError(error) || formatError(updateError) || formatError(loadingError);

  const defaultValues = useMemo(
    () =>
      entityField && {
        ...entityField,
        properties: entityField.properties,
      },
    [entityField]
  );

  const result = {
    data,
    loading,
    entity,
    entityDisplayName,
    entityField,
    defaultValues,
    application,
    lookupPendingData,
    hasError,
    errorMessage,
    setError,
    handleSubmit,
    hideRelatedFieldDialog,
    handleRelatedFieldFormSubmit,
    handleDeleteField
  };

  return result;
};

export default useEntityField;

const GET_ENTITY_FIELD = gql`
  query getEntityField($entity: String!, $field: String) {
    entity(where: { id: $entity }) {
      id
      name
      displayName
      pluralDisplayName
      fields(where: { id: { equals: $field } }) {
        id
        createdAt
        updatedAt
        name
        displayName
        dataType
        properties
        required
        searchable
        description
      }
    }
  }
`;

const UPDATE_ENTITY_FIELD = gql`
  mutation updateEntityField(
    $data: EntityFieldUpdateInput!
    $where: WhereUniqueInput!
    $relatedFieldName: String
    $relatedFieldDisplayName: String
  ) {
    updateEntityField(
      data: $data
      where: $where
      relatedFieldName: $relatedFieldName
      relatedFieldDisplayName: $relatedFieldDisplayName
    ) {
      id
      createdAt
      updatedAt
      name
      displayName
      dataType
      properties
      required
      searchable
      description
    }
  }
`;
