import { useState, useCallback, useMemo, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";
import { GET_ENTITIES } from "@hooks/useEntityList";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";

export type Props = {
  entityId: string;
};

const useEntityFieldList = ({ entityId }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setSearchPhrase("");
  }, []);

  const { data, loading, error: errorLoading } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const { data: entityList } = useQuery<{
    entities: models.Entity[];
  }>(GET_ENTITIES, {
    variables: {
      id: data?.entity.appId,
      orderBy: undefined,
      whereName: undefined,
    },
    skip: !data,
  });

  const entityIdToName = useMemo(() => {
    if (!entityList) return null;
    return Object.fromEntries(
      entityList.entities.map((entity) => [entity.id, entity.name])
    );
  }, [entityList]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const result = {
    data,
    loading,
    error,
    errorMessage,
    errorLoading,
    entityIdToName,
    setError,
    handleSearchChange,
  };

  return result;
};

export default useEntityFieldList;

/**@todo: expand search on other field  */
export const GET_FIELDS = gql`
  query getEntityFields(
    $id: String!
    $orderBy: EntityFieldOrderByInput
    $whereName: StringFilter
  ) {
    entity(where: { id: $id }) {
      id
      appId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
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
  }
`;
