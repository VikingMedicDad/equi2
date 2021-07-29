import React, { useEffect } from "react";
import { Form, Input } from "formik-antd";
import { Formik } from "formik";
import { message, Empty, Row, Col } from 'antd';
import * as models from "models";
import useWorkspaceForm from "@hooks/useWorkspaceForm";
import FormikAutoSave from "util/formikAutoSave";
import { validate } from "util/formikValidateJsonSchema";
import WorkspaceSelector from "@amp-components/Workspaces/WorkspaceSelector";
import ApplicationSelector from "@amp-components/Application/ApplicationSelector";
import "./WorkspaceForm.scss";


const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
};

const CLASS_NAME = "workspace-form";

function WorkspaceForm() {

  const {
    data,
    handleSubmit,
    error,
    errorMessage
  } = useWorkspaceForm();

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <div className={CLASS_NAME}>
      {data?.currentWorkspace && (
        <Formik
          initialValues={data.currentWorkspace}
          validate={(values: models.Workspace) => validate(values, FORM_SCHEMA)}
          enableReinitialize
          onSubmit={handleSubmit}
          render={(props) => (
              <Form
                layout="vertical"
                size="large"
              >
                <FormikAutoSave debounceMS={1000} />
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label="Workspace Name"
                      name="name" 
                  >
                    <Input name="name" placeholder="Workspace Name" />
                  </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                      <Form.Item
                        label="Workspace Selector"
                        name="workspace" 
                    >
                      <WorkspaceSelector />
                    </Form.Item>
                  </Col>
                  <Col span={12} offset={1}>
                      <Form.Item
                        label="Current Application"
                        name="applicatioon" 
                    >
                      <ApplicationSelector />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                    label="Workspace Members"
                    name="members" 
                >
                  <Empty 
                    description={
                      <span>
                        No user avalaible for this workspace
                      </span>
                    }
                  />
                </Form.Item>
              </Form>
          )}
        />
      )}
    </div>
  );
}

export default WorkspaceForm;
