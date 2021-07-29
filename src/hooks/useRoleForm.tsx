import { useMemo } from "react";
import omit from "lodash.omit";
import * as models from "models";

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.AppRole> = {
  name: "",
  displayName: "",
  description: "",
};

const useRoleForm = ({ defaultValues }: any) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.AppRole;
  }, [defaultValues]);

  const result = {
    initialValues
  };

  return result;
};

export default useRoleForm;
