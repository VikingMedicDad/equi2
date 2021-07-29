import { useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { setToken } from "../authentication/authentication";
import { formatError } from "util/error";

const useSignup = () => {
  const history = useHistory();
  const location = useLocation();
  const [signup, { loading, data, error }] = useMutation(DO_SIGNUP);

  const handleSubmit = useCallback(
    (values) => {
      const { confirm, confirmPassword, ...data } = values; // eslint-disable-line @typescript-eslint/no-unused-vars
      signup({variables: {data: {...data,},},}).catch(console.error);
    },
    [signup]
  );

  useEffect(() => {
    if (data) {
      setToken(data.signup.token);
      // @ts-ignore
      const { from } = location.state || { from: { pathname: "/create-app" } };
      history.replace(from);
    }
  }, [data, history, location]);

  const errorMessage = formatError(error);

  const result = {
    loading,
    handleSubmit,
    error,
    errorMessage
  };

  return result;

};

export default useSignup;

const DO_SIGNUP = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
    }
  }
`;
