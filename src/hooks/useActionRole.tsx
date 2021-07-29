import { useCallback } from "react";

const useActionRole = ({ role, onClick }: any) => {
  const handleClick = useCallback(
    (selected) => {
      onClick(role, selected);
    },
    [onClick, role]
  );

  const result = {
    handleClick
  };

  return result;
};

export default useActionRole;