import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

type TPages = {
  entity: {
    fields: [
      {
        name: string;
        displayName: string;
      }
    ];
  };
};

const useEntityFieldMultiSelect = ({ entityId } : any) => {
  const { data } = useQuery<TPages>(GET_ENTITY_FIELDS, {
    variables: {
      entityId: entityId,
    },
  });

  const options = useMemo(() => {
    return data
      ? data.entity.fields.map((field) => ({
          value: field.name,
          label: field.displayName,
        }))
      : [];
  }, [data]);

  const result = {
    options
  };

  return result;
};

export default useEntityFieldMultiSelect;

export const GET_ENTITY_FIELDS = gql`
  query getPages($entityId: String!) {
    entity(where: { id: $entityId }) {
      fields {
        name
        displayName
      }
    }
  }
`;
