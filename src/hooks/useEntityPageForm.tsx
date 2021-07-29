import { useCallback, useState, useMemo } from "react";
import omitDeep from "deepdash-es/omitDeep";
import { gql, useQuery } from "@apollo/client";
import * as models from "models";

type EntityPageInput = Omit<models.EntityPage, "blockType" | "versionNumber">;

type TEntities = {
  entities: [
    {
      id: string;
      displayName: string;
    }
  ];
};

export type Props = {
  entityPage?: models.EntityPage;
  onSubmit: (entityPage: EntityPageInput) => void;
  applicationId: string;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "blockType",
  "versionNumber",
  "__typename",
];

export enum SidebarTab {
  Properties,
  Display,
}

export const INITIAL_VALUES: Omit<
  models.EntityPage,
  "createdAt" | "updatedAt" | "inputParameters" | "outputParameters"
> = {
  displayName: "",
  description: "",
  pageType: models.EnumEntityPageType.SingleRecord,
  blockType: models.EnumBlockType.EntityPage,
  entityId: "",
  id: "",
  versionNumber: 0,
  showAllFields: true,
  showFieldList: [],
};

const PAGE_TYPE_INITIAL_VALUES: {
  [page: string]: Object;
} = {
  [models.EnumEntityPageType.List]: {
    listSettings: {
      enableSearch: true,
      navigateToPageId: "",
      allowCreation: false,
      allowDeletion: false,
    },
  },
  [models.EnumEntityPageType.SingleRecord]: {
    singleRecordSettings: {
      allowCreation: true,
      allowDeletion: false,
      allowUpdate: false,
    },
  },
};

const useEntityPageForm = ({ entityPage, onSubmit, applicationId }: Props) => {
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      appId: applicationId,
    },
  });

  const entityListOptions = useMemo(() => {
    const noneOption = { value: "", label: "None" };
    const returnList = entityList
      ? entityList.entities.map((entity) => ({
          value: entity.id || "",
          label: entity.displayName,
        }))
      : [];
    returnList.push(noneOption);
    return returnList;
  }, [entityList]);

  const [selectedTab, setSelectedTab] = useState<SidebarTab>(
    SidebarTab.Properties
  );

  const handleActivate = useCallback(
    (event) => {
      setSelectedTab(event.detail.index);
    },
    [setSelectedTab]
  );

  const initialValues = useMemo(() => {
    const pageTypeInitialValues =
      (entityPage && PAGE_TYPE_INITIAL_VALUES[entityPage.pageType]) ||
      PAGE_TYPE_INITIAL_VALUES[models.EnumEntityPageType.SingleRecord];

    const sanitizedDefaultValues = omitDeep(
      {
        ...INITIAL_VALUES,
        ...pageTypeInitialValues,
        ...entityPage,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as EntityPageInput;
  }, [entityPage]);

  const result = {
    selectedTab,
    models,
    initialValues,
    entityListOptions,
    SidebarTab,
    handleActivate,
  };
  
  return result;
};

export default useEntityPageForm;

export const GET_ENTITIES = gql`
  query getEntities($appId: String!) {
    entities(where: { app: { id: $appId } }) {
      id
      displayName
    }
  }
`;
