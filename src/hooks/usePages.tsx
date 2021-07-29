import { match } from "react-router-dom";
import * as models from "models";
import useNavigationTabs from "@hooks/useNavigationTabs";

export type Props = {
  match: match<{ application: string }>;
};

const blockTypes = [
  models.EnumBlockType.Layout,
  models.EnumBlockType.CanvasPage,
  models.EnumBlockType.EntityPage,
  models.EnumBlockType.Document,
];

const NAVIGATION_KEY = "PAGES";

function usePages({ match }: Props) {
  const { application } = match.params;
  useNavigationTabs(application, NAVIGATION_KEY, match.url, "Pages");
  
  const result = {
    application,
    blockTypes
  };

  return result;

}

export default usePages;
