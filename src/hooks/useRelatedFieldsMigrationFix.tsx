import { gql, useMutation, useQuery } from "@apollo/client";
import { camelCase } from "camel-case";
import { keyBy } from "lodash";
import { useCallback, useContext, useMemo } from "react";
import { match } from "react-router-dom";
import useNavigationTabs from "@hooks/useNavigationTabs";
import * as models from "models";
import { formatError } from "util/error";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import {
  FormValues
} from "./EntityRelationFieldsChart";

type TData = {
  app: models.App;
};

export type Props = {
  match: match<{ application: string }>;
};

const NAVIGATION_KEY = "FIX_RELATED_ENTITIES";

const useRelatedFieldsMigrationFix = ({ match }: Props) => {
  const applicationId = match.params.application;
  const pendingChangesContext = useContext(PendingChangesContext);

  useNavigationTabs(
    applicationId,
    NAVIGATION_KEY,
    match.url,
    "Fix Entity Relations"
  );

  const { data, loading, error, refetch } = useQuery<TData>(GET_LOOKUP_FIELDS, {
    variables: {
      appId: applicationId,
    },
  });

  const [createDefaultRelatedEntity, { error: createError }] = useMutation<{
    createDefaultRelatedField: models.EntityField;
  }>(CREATE_DEFAULT_RELATED_ENTITY, {
    onCompleted: (createData) => {
      refetch();
      pendingChangesContext.addEntity(
        createData.createDefaultRelatedField.properties.relatedEntityId
      );

      const entity = data?.app.entities.find((entity) =>
        entity.fields?.some(
          (field) => field.id === createData.createDefaultRelatedField.id
        )
      );
      if (entity) {
        pendingChangesContext.addEntity(entity.id);
      }
    },
  });

  const handleRelatedFieldFormSubmit = useCallback(
    (relatedFieldValues: FormValues) => {
      createDefaultRelatedEntity({
        variables: {
          fieldId: relatedFieldValues.fieldId,
          relatedFieldDisplayName: relatedFieldValues.relatedFieldDisplayName,
          relatedFieldName: camelCase(
            relatedFieldValues.relatedFieldDisplayName
          ),
        },
      }).catch(console.error);
    },
    [createDefaultRelatedEntity]
  );

  const entityDictionary = useMemo(() => {
    return keyBy(data?.app.entities, (entity) => entity.id);
  }, [data]);

  const fieldDictionary = useMemo(() => {
    const allFields =
      data?.app.entities.flatMap((entity) => entity.fields || []) || [];

    const d = keyBy(allFields, (field) => field.permanentId);
    console.log(d);
    return d;
  }, [data]);

  const errorMessage =
    (error && formatError(error)) || (createError && formatError(createError));


  const result = {
    applicationId,
    loading,
    data,
    entityDictionary,
    fieldDictionary,
    error,
    createError,
    errorMessage,
    handleRelatedFieldFormSubmit
  };

  return result;
};

export default useRelatedFieldsMigrationFix;

export const GET_LOOKUP_FIELDS = gql`
  query getAppLookupFields($appId: String!) {
    app(where: { id: $appId }) {
      id
      name
      entities(orderBy: { displayName: Asc }) {
        id
        name
        displayName
        pluralDisplayName
        fields(
          where: { dataType: { equals: Lookup } }
          orderBy: { displayName: Asc }
        ) {
          id
          permanentId
          displayName
          name
          properties
        }
      }
    }
  }
`;

const CREATE_DEFAULT_RELATED_ENTITY = gql`
  mutation createDefaultRelatedEntity(
    $fieldId: String!
    $relatedFieldName: String
    $relatedFieldDisplayName: String
  ) {
    createDefaultRelatedField(
      where: { id: $fieldId }
      relatedFieldName: $relatedFieldName
      relatedFieldDisplayName: $relatedFieldDisplayName
    ) {
      id
      name
      displayName
      properties
    }
  }
`;
