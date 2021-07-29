import { useCallback } from "react";
import { useFormikContext } from "formik";

const useRelationAllowMultiple = ({fieldName}: any) => {
  
  const formik = useFormikContext<{
    id: string;
    displayName: string;
    properties: {
      relatedEntityId: string;
      relatedFieldId: string;
      allowMultipleSelection: boolean;
    };
  }>();

  const handleChange = useCallback(
    (event) => {
      const selectedValue = event.currentTarget.value === "true";
      formik.setFieldValue(fieldName, selectedValue, false);
    },
    [formik, fieldName]
  );

  const result = {
    formik,
    handleChange
  };

  return result;
};

export default useRelationAllowMultiple;
