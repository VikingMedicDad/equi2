import { useCallback, useEffect, useMemo } from "react";
import { Location } from "history";
import { useHistory, useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { setToken } from "../authentication/authentication";
import { formatError } from "util/error";
import queryString from "query-string";
import { DEFAULT_PAGE_SOURCE, SIGN_IN_PAGE_CONTENT } from "@amp-components/User/constants";

// import "./Login.scss";

interface LocationStateInterface {
  from?: Location;
}

const URL_SOURCE_PARAM = "utm_source";

const useLogin = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, { loading, data, error }] = useMutation(DO_LOGIN);

  const content = useMemo(() => {
    const s: LocationStateInterface | undefined | null = location.state;
    const urlParams = new URLSearchParams(s?.from?.search);
    const source = urlParams.get(URL_SOURCE_PARAM) || DEFAULT_PAGE_SOURCE;
    return (
      SIGN_IN_PAGE_CONTENT[source] || SIGN_IN_PAGE_CONTENT[DEFAULT_PAGE_SOURCE]
    );
  }, [location.state]);

  const handleSubmit = useCallback(
    (data) => {
      login({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [login]
  );

  const urlError = useMemo(() => {
    const params = queryString.parse(location.search);
    console.log("params", params);
    console.log("params.error", params.error);
    return params.error;
  }, [location.search]);

  useEffect(() => {
    if (data) {
      setToken(data.login.token);
      // @ts-ignore
      let { from } = location.state || { from: { pathname: "/" } };
      if (from === "login") {
        from = "/";
      }
      history.replace(from);
    }
  }, [data, history, location]);

  const errorMessage = formatError(error);

  const result = {
    content,
    urlError,
    loading,
    error,
    errorMessage,
    handleSubmit
  };

  return result; 
};

export default useLogin;

const DO_LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`;
