import React from "react";
import useDeleteApiToken, { Props } from "@hooks/useDeleteApiToken";
import { DeleteTwoTone} from "@ant-design/icons";
import { Button , Popconfirm} from "antd";

const DeleteApiToken = ({ apiToken, onDelete, onError }: Props) => {
 
  const {
    deleteLoading,
    handleConfirmDelete,
  } = useDeleteApiToken({
    apiToken, onDelete, onError
  });

  return (
    <>

    <Popconfirm 
        placement="leftTop" 
        title="This API token will stop working immediately. Are you sure you want to delete this token?" 
        onConfirm={handleConfirmDelete} okText="Yes" 
        cancelText="No">
        {!deleteLoading && (
            <Button
            type="default"
            icon={
                <>
                    <DeleteTwoTone twoToneColor="red"/>
                </>
            }
            size={"small"} 
        />)}
    </Popconfirm>
</>
  );
};

export default DeleteApiToken;