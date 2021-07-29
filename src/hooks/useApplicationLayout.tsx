import { useState, useCallback, useEffect, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { GET_APPLICATION } from "@hooks/useApplicationHome";
import * as models from "models";

import {
  PendingChangeItem,
} from "@amp-components/VersionControl/PendingChangesContext";
import { getLSCurrentApplication } from "@hooks/useApplicationSelector";


export enum EnumFixedPanelKeys {
  None = "None",
  PendingChanges = "PendingChanges",
}

export type ApplicationData = {
  app: models.App;
};

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

function useApplicationLayout() {

  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);
  const [commitRunning, setCommitRunning] = useState<boolean>(false);
  const application = getLSCurrentApplication();


  const [selectedFixedPanel, setSelectedFixedPanel] = useState<string>(
    EnumFixedPanelKeys.PendingChanges
  );

  const handleMenuItemWithFixedPanelClicked = useCallback(
    (panelKey: string) => {
      if (selectedFixedPanel === panelKey) {
        setSelectedFixedPanel(EnumFixedPanelKeys.None);
      } else {
        setSelectedFixedPanel(panelKey);
      }
    },
    [selectedFixedPanel]
  );

  const { data: pendingChangesData, refetch } = useQuery<PendingChangeStatusData> (
    GET_PENDING_CHANGES_STATUS, {
    variables: {
      applicationId: application,
    },
  });

  const { data: applicationData } = useQuery<ApplicationData>(GET_APPLICATION, {
    variables: {
      id: application,
    },
  });

  useEffect(() => {
    setPendingChanges(
      pendingChangesData ? pendingChangesData.pendingChanges : []
    );
  }, [pendingChangesData, setPendingChanges]);

  const addChange = useCallback(
    (
      resourceId: string,
      resourceType: models.EnumPendingChangeResourceType
    ) => {
      const existingChange = pendingChanges.find(
        (changeItem) =>
          changeItem.resourceId === resourceId &&
          changeItem.resourceType === resourceType
      );
      if (existingChange) {
        //reassign pending changes to trigger refresh
        setPendingChanges([...pendingChanges]);
      } else {
        setPendingChanges(
          pendingChanges.concat([
            {
              resourceId,
              resourceType,
            },
          ])
        );
      }
    },
    [pendingChanges, setPendingChanges]
  );

  const addEntity = useCallback(
    (entityId: string) => {
      addChange(entityId, models.EnumPendingChangeResourceType.Entity);
    },
    [addChange]
  );

  const addBlock = useCallback(
    (blockId: string) => {
      addChange(blockId, models.EnumPendingChangeResourceType.Block);
    },
    [addChange]
  );

  const resetPendingChanges = useCallback(() => {
    setPendingChanges([]);
    refetch();
  }, [refetch]);

  const setCommitRunningCallback = useCallback(
    
    (isRunning: boolean) => {
      setCommitRunning(isRunning);
    },
    [setCommitRunning]
  );

  const pendingChangesContextValue = useMemo(
    () => ({
      pendingChanges,
      commitRunning,
      setCommitRunning: setCommitRunningCallback,
      addEntity,
      addBlock,
      addChange,
      reset: resetPendingChanges,
    }),
    [
      pendingChanges,
      commitRunning,
      addEntity,
      addBlock,
      addChange,
      resetPendingChanges,
      setCommitRunningCallback,
    ]
  );

  const pendingChangesBadge =
    (pendingChanges.length && pendingChanges.length.toString()) || null;

  const result = {
    pendingChangesBadge,
    pendingChangesContextValue,
    application,
    applicationData,
    selectedFixedPanel,
    handleMenuItemWithFixedPanelClicked
  };

  return result;
}

export default useApplicationLayout;

export const GET_PENDING_CHANGES_STATUS = gql`
  query pendingChangesStatus($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
      resourceId
      resourceType
    }
  }
`;
