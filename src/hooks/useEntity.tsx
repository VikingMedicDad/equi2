import { useCallback, useContext } from "react";
import { match, useLocation } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";
import * as models from "models";
import { formatError } from "util/error";
import useNavigationTabs from "@hooks/useNavigationTabs";
import { useTracking } from "util/analytics";

export type Props = {
  match: match<{ fieldId: string }>;
  entityId: string;
  application: string;
};

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntity: models.Entity;
};
const NAVIGATION_KEY = "ENTITY";

const useEntity = ({ match, entityId, application }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);
  const location = useLocation();

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  useNavigationTabs(
    application,
    `${NAVIGATION_KEY}_${entityId}`,
    location.pathname,
    data?.entity.displayName
  );

  const [updateEntity, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "updateEntity",
          entityName: data.updateEntity.displayName,
        });
        pendingChangesContext.addEntity(data.updateEntity.id);
      },
    }
  );

  const handleSubmit = useCallback(
    (data: Omit<models.Entity, "versionNumber">) => {
      /**@todo: check why the "fields" and "permissions" properties are not removed by omitDeep in the form */

      let {
        id,
        fields, // eslint-disable-line @typescript-eslint/no-unused-vars
        permissions, // eslint-disable-line @typescript-eslint/no-unused-vars
        lockedByUser, // eslint-disable-line @typescript-eslint/no-unused-vars
        ...sanitizedCreateData
      } = data;

      updateEntity({
        variables: {
          data: {
            ...sanitizedCreateData,
          },
          where: {
            id: id,
          },
        },
      }).catch(console.error);
    },
    [updateEntity]
  );

  const errorMessage = formatError(error || updateError);

  const result = {
    loading,
    data,
    entityId,
    application,
    error,
    errorMessage,
    updateError,
    handleSubmit
  };

  return result;
};

export default useEntity;

export const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
      id
      name
      displayName
      pluralDisplayName
      description
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!, $where: WhereUniqueInput!) {
    updateEntity(data: $data, where: $where) {
      id
      name
      displayName
      pluralDisplayName
      description
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
        }
      }
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;
