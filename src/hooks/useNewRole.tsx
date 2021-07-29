import { useCallback, useRef, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { camelCase } from "camel-case";
import { formatError } from "util/error";
import * as models from "models";

export type Props = {
  applicationId: string;
  onRoleAdd?: (role: models.AppRole) => void;
};

const useNewRole = ({ onRoleAdd, applicationId }: Props) => {
  const [createRole, { error, loading }] = useMutation(CREATE_ROLE, {
    update(cache, { data }) {
      if (!data) return;

      const newAppRole = data.createAppRole;

      cache.modify({
        fields: {
          appRoles(existingAppRoleRefs = [], { readField }) {
            const newAppRoleRef = cache.writeFragment({
              data: newAppRole,
              fragment: NEW_ROLE_FRAGMENT,
            });

            if (
              existingAppRoleRefs.some(
                (appRoleRef: Reference) =>
                  readField("id", appRoleRef) === newAppRole.id
              )
            ) {
              return existingAppRoleRefs;
            }

            return [...existingAppRoleRefs, newAppRoleRef];
          },
        },
      });
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(true);
      createRole({
        variables: {
          data: {
            ...data,
            name: camelCase(data.displayName),

            app: { connect: { id: applicationId } },
          },
        },
      })
        .then((result) => {
          if (onRoleAdd) {
            onRoleAdd(result.data.createAppRole);
          }
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createRole, applicationId, inputRef, onRoleAdd]
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

export default useNewRole;

const CREATE_ROLE = gql`
  mutation createAppRole($data: AppRoleCreateInput!) {
    createAppRole(data: $data) {
      id
      name
      displayName
      description
    }
  }
`;

const NEW_ROLE_FRAGMENT = gql`
  fragment NewAppRole on AppRole {
    id
    name
    displayName
    description
  }
`;
