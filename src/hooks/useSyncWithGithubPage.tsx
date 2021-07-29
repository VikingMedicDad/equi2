import { useQuery } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";
import { GET_APPLICATION } from "@hooks/useApplicationHome";
import { getLSCurrentApplication } from "@hooks/useApplicationSelector";


function useSyncWithGithubPage() {
  const application = getLSCurrentApplication();

  const { data, error, refetch } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: application,
    },
  });

  const errorMessage = formatError(error);

  const result = {
    data,
    error,
    errorMessage,
    refetch
  };

  return result;
}

export default useSyncWithGithubPage;
