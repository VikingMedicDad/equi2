import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import * as models from "models";

import useAuthenticated from "@hooks/use-authenticated";
import { setUserId, identifySetOnce } from "util/analytics";

type TData = {
  me: {
    account: models.Account;
  };
};

function useUserBadge() {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });

  useEffect(() => {
    if (data) {
      setUserId(data.me.account.id);
      identifySetOnce({ key: "signupDate", value: new Date() });
    }
  }, [data]);

  const result = {
    data
  };

  return result;
}

export default useUserBadge;

const GET_USER = gql`
  query getUser {
    me {
      account {
        id
        email
        firstName
        lastName
      }
    }
  }
`;
