import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { Spin, message, Empty } from 'antd';
import SearchInput from "@amp-components/Workspaces/SearchInput";
import { Button, Row, Col } from "antd";
import { SvgThemeImage, EnumImages } from "@amp-components/Components/SvgThemeImage";
import { AppstoreAddOutlined } from '@ant-design/icons';
import ApplicationListItem from "@amp-components/Workspaces/ApplicationListItem";
import useApplicationList from "@hooks/useApplicationList";
import "./ApplicationList.scss";

const CLASS_NAME = "application-list";

function ApplicationList() {
  
  const {
    loading,
    data,
    error,
    errorMessage,
    handleSearchChange,
    handleNewAppClick
  } = useApplicationList();

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <div className={CLASS_NAME}>
      <Row className={`${CLASS_NAME}__header`}>
        <Col span={2}>
          <SearchInput onSearchResult={handleSearchChange}/>
        </Col>
        <Col span={2}>
          <Link onClick={handleNewAppClick} to="/create-app">
            <Button
              className={`${CLASS_NAME}__add-button`}
              type="primary"
              icon={<AppstoreAddOutlined />}
            >
              New app
            </Button>
          </Link>
        </Col>
      </Row>
      <div className={`${CLASS_NAME}__title`}>{data?.apps.length} Apps</div>
      {loading && <Spin />}

      {isEmpty(data?.apps) && !loading ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <SvgThemeImage image={EnumImages.AddApp} />
          <div className={`${CLASS_NAME}__empty-state__title`}>
            <Empty 
              description={
                <span>
                  There are no app to show
                </span>
              }
            />
          </div>
        </div>
      ) : (
        data?.apps.map((app) => {
          return <ApplicationListItem key={app.id} app={app} />;
        })
      )}

    </div>
  );
}

export default ApplicationList;