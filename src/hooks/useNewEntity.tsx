import { useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation, Reference } from "@apollo/client";
import { pascalCase } from "pascal-case";
import { formatError } from "util/error";
import * as models from "models";
import {
  generatePluralDisplayName,
  generateSingularDisplayName,
} from "../Components/PluralDisplayNameField";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import { useTracking } from "util/analytics";

export type CreateEntityType = Omit<models.EntityCreateInput, "app">;

type DType = {
  createOneEntity: models.Entity;
};

export type Props = {
  applicationId: string;
};

const useNewEntity = ({ applicationId }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const [createEntity, { error, data, loading }] = useMutation<DType>(
    CREATE_ENTITY,
    {
      onCompleted: (data) => {
        pendingChangesContext.addEntity(data.createOneEntity.id);
        trackEvent({
          eventName: "createEntity",
          entityName: data.createOneEntity.displayName,
        });
      },
      update(cache, { data }) {
        if (!data) return;

        const newEntity = data.createOneEntity;

        cache.modify({
          fields: {
            entities(existingEntityRefs = [], { readField }) {
              const newEntityRef = cache.writeFragment({
                data: newEntity,
                fragment: NEW_ENTITY_FRAGMENT,
              });

              if (
                existingEntityRefs.some(
                  (EntityRef: Reference) =>
                    readField("id", EntityRef) === newEntity.id
                )
              ) {
                return existingEntityRefs;
              }

              return [...existingEntityRefs, newEntityRef];
            },
          },
        });
      },
    }
  );
  const history = useHistory();

  const handleSubmit = useCallback(
    (data: CreateEntityType) => {
      const displayName = data.displayName.trim();
      const pluralDisplayName = generatePluralDisplayName(displayName);
      const singularDisplayName = generateSingularDisplayName(displayName);
      const name = pascalCase(singularDisplayName);

      createEntity({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            pluralDisplayName,
            app: { connect: { id: applicationId } },
          },
        },
      }).catch(console.error);
    },
    [createEntity, applicationId]
  );

  useEffect(() => {
    if (data) {
      history.push(`/${applicationId}/entities/${data.createOneEntity.id}`);
    }
  }, [history, data, applicationId]);

  const errorMessage = formatError(error);

  const result = {
    loading,
    error,
    errorMessage,
    handleSubmit
  };

  return result; 
};

export default useNewEntity;

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
      name
      fields {
        id
        name
        dataType
      }
    }
  }
`;

const NEW_ENTITY_FRAGMENT = gql`
  fragment NewEntity on Entity {
    id
    name
    fields {
      id
      name
      dataType
    }
  }
`;
