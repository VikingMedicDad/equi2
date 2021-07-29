import { match, useRouteMatch } from "react-router-dom";
import useNavigationTabs from "@hooks/useNavigationTabs";

export type Props = {
  match: match<{ application: string }>;
};
const NAVIGATION_KEY = "ROLE";

const useRolesPage = ({ match }: Props) => {
  const { application } = match.params;

  useNavigationTabs(application, NAVIGATION_KEY, match.url, "Roles");

  const roleMatch = useRouteMatch<{ roleId: string }>(
    "/:application/roles/:roleId"
  );

  let roleId = null;
  if (roleMatch) {
    roleId = roleMatch.params.roleId;
  }

  const result = {
    application,
    roleId
  };

  return result;
};

export default useRolesPage;
