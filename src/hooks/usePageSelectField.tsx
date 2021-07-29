import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { SelectFieldProps } from "@amplication/design-system";

type TPages = {
  blocks: [
    {
      id: string;
      displayName: string;
    }
  ];
};

export type Props = Omit<SelectFieldProps, "options"> & {
  applicationId: string;
  //none: null;
};
const NONE_OPTION = { value: "", label: "None" };

const usePageSelectField = (props: Props) => {
  const { applicationId } = props;

  const { data: pageList } = useQuery<TPages>(GET_PAGES, {
    variables: {
      appId: applicationId,
    },
  });

  const pageListOptions = useMemo(() => {
    const returnList = pageList
      ? pageList.blocks.map((page) => ({
          value: page.id || "",
          label: page.displayName,
        }))
      : [];
    returnList.push(NONE_OPTION);
    return returnList;
  }, [pageList]);

  const result = {
    pageListOptions
  };

  return result;

};

export default usePageSelectField;

export const GET_PAGES = gql`
  query getPages($appId: String!) {
    blocks(
      where: {
        app: { id: $appId }
        blockType: { in: [CanvasPage, EntityPage] }
      }
      orderBy: { displayName: Asc }
    ) {
      id
      displayName
    }
  }
`;
