import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

export type Props = {
  applicationId: string;
};

type TData = {
  appValidateBeforeCommit: models.AppValidationResult;
};

const POLL_INTERVAL = 30000;

const useCommitValidation = ({ applicationId }: Props) => {
  const { data, error, startPolling, stopPolling } = useQuery<TData>(
    APP_VALIDATE_BEFORE_COMMIT,
    {
      onCompleted: (data) => {
        //Start polling if status is invalid
        if (!data.appValidateBeforeCommit.isValid) {
          startPolling(POLL_INTERVAL);
        }
      },
      variables: {
        appId: applicationId,
      },
    }
  );

  //stop polling in case the status is value
  useEffect(() => {
    if (data?.appValidateBeforeCommit.isValid) {
      stopPolling();
    } else {
      startPolling(POLL_INTERVAL);
    }
  }, [data, stopPolling, startPolling]);

  const errorMessage = formatError(error);


  const result = {
    data,
    errorMessage
  };

  return result;
};

export default useCommitValidation;

export const APP_VALIDATE_BEFORE_COMMIT = gql`
  query appValidateBeforeCommit($appId: String!) {
    appValidateBeforeCommit(where: { id: $appId }) {
      isValid
      messages
    }
  }
`;
