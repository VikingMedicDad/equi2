import { useCallback, useState } from "react";

export type Props = {
  isOpen: boolean;
  badgeValue?: string | null;
  panelKey: string;
  applicationId: string;
  onClick: (panelKey: string) => void;
};

const CLASS_NAME = "pending-changes-menu-item";
const LOCAL_STORAGE_KEY = "pendingChangesPopoverDismissed";

const usePendingChangesMenuItem = ({
  isOpen,
  badgeValue,
  panelKey,
  applicationId,
  onClick,
}: Props) => {
  const [popoverDismissed, setPopoverDismissed] = useState(
    Boolean(localStorage.getItem(LOCAL_STORAGE_KEY))
  );

  const handleClick = useCallback(
    (panelKey: string) => {
      localStorage.setItem("pendingChangesPopoverDismissed", "true");
      setPopoverDismissed(true);
      onClick(panelKey);
    },
    [onClick]
  );

  const pendingChangesPopoverOpen =
    Boolean(badgeValue) && !isOpen && !popoverDismissed;

  const popoverOpenClassName = `${CLASS_NAME}--popover-open`;

  const result = {
    popoverOpenClassName,
    pendingChangesPopoverOpen,
    handleClick
  };

  return result;
};

export default usePendingChangesMenuItem;
