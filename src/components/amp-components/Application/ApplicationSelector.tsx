import React from "react";
import classNames from "classnames";
import ApplicationSelectorList from "@amp-components/Application/ApplicationSelectorList";
import useApplicationSelector from "@hooks/useApplicationSelector";
import { Spin, Button } from "antd";
import { SwitcherOutlined  } from '@ant-design/icons';
import "./ApplicationSelector.scss";

const CLASS_NAME = "application-selector";

function ApplicationSelector() {
  
 const {
    loading,
    isOpen,
    data,
    handleSetCurrentApplication,
    handleOpen
  } = useApplicationSelector();

  return (
    <div className={CLASS_NAME}>
      <div
        className={classNames(`${CLASS_NAME}__current`, {
          [`${CLASS_NAME}__current--active`]: isOpen,
        })}
        onClick={handleOpen}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            <span className={`${CLASS_NAME}__current__name`}>
              {data?.app.name}
            </span>
            <Button
              className={`${CLASS_NAME}__add-button`}
              type="link"
              disabled={loading}
              icon={<SwitcherOutlined />}
            >
            </Button>
          </>
        )}
      </div>
      {isOpen && (
        <ApplicationSelectorList
          onApplicationSelected={handleSetCurrentApplication}
        />
      )} 
    </div>
  );
}

export default ApplicationSelector;
