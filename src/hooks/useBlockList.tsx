import { useState, useMemo, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "util/error";
import keyBy from "lodash.keyby";
import { useHistory } from "react-router-dom";

import * as models from "models";
import {
  DataFilter,
  SortData
} from "@amplication/design-system";
import { paramCase } from "param-case";

import pluralize from "pluralize";

type TData = {
  blocks: models.Block[];
};

const NAME_FIELD = "displayName";
const BLOCK_TYPE = "blockType";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

export type Props = {
  applicationId: string;
  blockTypes: models.EnumBlockType[];
  title: string;
};

const useBlockList = ({ applicationId, blockTypes, title }: Props) => {
  const history = useHistory();

  const [sortDir, setSortDir] = useState<SortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [filters, setFilters] = useState<DataFilter[]>([
    {
      name: BLOCK_TYPE,
      title: "Type",
      filterItems: blockTypes.map((type) => ({ label: type, value: type })),
      selected: new Set<string>(),
    },
  ]);

  const filtersByName = useMemo(() => keyBy(filters, (filter) => filter.name), [
    filters,
  ]);

  const handleSortChange = (sortData: SortData) => {
    setSortDir(sortData);
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const handleFilterChange = (filters: DataFilter[]) => {
    setFilters(filters);
  };

  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes:
        filtersByName &&
        filtersByName[BLOCK_TYPE] &&
        filtersByName[BLOCK_TYPE].selected &&
        filtersByName[BLOCK_TYPE].selected.size
          ? [...filtersByName[BLOCK_TYPE].selected]
          : blockTypes,
      orderBy: {
        [sortDir.field || NAME_FIELD]:
          sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const handleRowClick = useCallback(
    (block: models.Block) => {
      const blockTypePath = getBlockTypePath(applicationId, block.blockType);
      history.push(`${blockTypePath}/${block.id}`);
    },
    [history, applicationId]
  );
  const errorMessage = formatError(error);

  const result = {
    loading,
    sortDir,
    filters,
    data,
    error,
    errorMessage,
    getBlockTypePath,
    handleSortChange,
    handleRowClick,
    handleSearchChange,
    handleFilterChange
  };
  
  return result;
};

export default useBlockList;

function getBlockTypePath(applicationId: string, type: string): string {
  const resource = paramCase(pluralize(type));
  return `/${applicationId}/${resource}`;
}

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_BLOCKS = gql`
  query getPages(
    $id: String!
    $blockTypes: [EnumBlockType!]
    $orderBy: BlockOrderByInput
    $whereName: StringFilter
  ) {
    blocks(
      where: {
        app: { id: $id }
        blockType: { in: $blockTypes }
        displayName: $whereName
      }
      orderBy: $orderBy
    ) {
      id
      displayName
      blockType
      versionNumber
      description
    }
  }
`;
