import React from "react";
import { Formik } from "formik";
import FormikAutoSave from "util/formikAutoSave";
import { USER_ENTITY } from "./constants";
import { validate } from "util/formikValidateJsonSchema";
import { isEqual } from "util/customValidations";
import useEntityForm, {Props} from "@hooks/useEntityForm";
import { Input, Form } from "formik-antd";
import { Row, Col } from "antd";
import "./Entity.scss";

const FORM_SCHEMA = {
  required: ["name", "displayName", "pluralDisplayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
    name: {
      type: "string",
      minLength: 2,
    },
    pluralDisplayName: {
      type: "string",
      minLength: 2,
    },
  },
};

const EQUAL_PLURAL_DISPLAY_NAME_AND_NAME_TEXT =
  "Name and plural display names cannot be equal. The ‘plural display name’ field must be in a plural form and ‘name’ field must be in a singular form";

const CLASS_NAME = "entity-form";

const EntityForm = React.memo(({ entity, applicationId, onSubmit }: Props) => {
  
  const {
    initialValues
  } = useEntityForm({ entity, applicationId, onSubmit });

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          if (isEqual(values.name, values.pluralDisplayName)) {
            return {
              pluralDisplayName: EQUAL_PLURAL_DISPLAY_NAME_AND_NAME_TEXT,
            };
          }
          return validate(values, FORM_SCHEMA);
        }}
        enableReinitialize
        onSubmit={onSubmit}
        render={() => {
          return (
            <Form layout="vertical" style={{
              margin: '0 25px',
              
            }} size="small">
              <FormikAutoSave debounceMS={1000} />
              <Row justify="space-between">
                <Col span={10}>
                  <Form.Item name={'name'} label="Name" >
                    <Input name={'name'} disabled={USER_ENTITY === entity?.name} autoComplete="off"/>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name={'displayName'} label="Display Name" >
                    <Input name={'displayName'} autoComplete="off"/>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name={'pluralDisplayName'} label="Plural Display Name" >
                    <Input name={'pluralDisplayName'} autoComplete="off"/>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name={'name'} label="Description" >
                    <Input.TextArea name={'description'} autoComplete="off" rows={3} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                
              </Row>
            </Form>
          );
        }}
      >
      </Formik>
    </div>
  );
});

export default EntityForm;
