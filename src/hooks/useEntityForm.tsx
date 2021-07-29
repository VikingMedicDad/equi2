import { useMemo } from "react";
import omitDeep from "deepdash-es/omitDeep";
import * as models from "models";

type EntityInput = Omit<models.Entity, "fields" | "versionNumber">;

export type Props = {
  entity?: models.Entity;
  applicationId: string;
  onSubmit: (entity: EntityInput) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "versionNumber",
  "fields",
  "permissions",
  "lockedAt",
  "lockedByUser",
  "lockedByUserId",
  "__typename",
];

const useEntityForm = ({ entity, applicationId, onSubmit }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      {
        ...entity,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as EntityInput;
  }, [entity]);

  const result = {
    initialValues
  };

  return result;
};

export default useEntityForm;
