import React, { useEffect } from "react";
import { Formik } from "formik";
import { Form, Input } from "formik-antd";
import { GlobalHotKeys } from "react-hotkeys";
import * as models from "models";
import useNewApiToken, { Props } from "@hooks/useNewApiToken";
import { Button, message, Typography } from "antd";
import { KeyOutlined } from "@ant-design/icons";

const {Text} = Typography;

const INITIAL_VALUES: models.ApiTokenCreateInput = {
  name: "",
};

const CLASS_NAME = "new-api-token";

const NewApiToken = ({ onCompleted }: Props) => {
  
  const {
    loading,
    keyMap,
    error,
    errorMessage,
    handleSubmit
  } = useNewApiToken(
    {onCompleted}
  );

  useEffect(() => {
    if(error){
        message.error(errorMessage);
    }
}, [error, errorMessage]);

  return (
    <div className='container'>
      <Text className={`${CLASS_NAME}__instructions`}>
        Give the new token a descriptive name.
      </Text>
      
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: models.ApiTokenCreateInput) =>
          console.log("values from form", values)
        }
        onSubmit={handleSubmit}
        render={(()=>{
            
            return (
                <Form>
                    <GlobalHotKeys keyMap={keyMap}  />
                    <Form.Item
                        name="name"
                    >
                        <Input
                            name="name"
                            disabled={loading}
                            autoFocus
                            placeholder="Token Name"
                            autoComplete="off"
                            allowClear
                            size="middle"
                            prefix={<KeyOutlined />}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="submit"
                    >
                        <Button
                            disabled={loading}
                            type="primary"
                            htmlType="submit"
                        >
                        Create Token
                    </Button>
                    </Form.Item>
                </Form>
            );
        })}
     / >
     {/* <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: models.ApiTokenCreateInput) =>
          validate(values, FORM_SCHEMA)
        }
        onSubmit={handleSubmit}
        // validateOnMount
        render={()=>{
            <>
            INITIAL_VALUES
            </>
        }}
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <Input
                name="name"
                disabled={loading}
                autoFocus
                placeholder="Token Name"
                autoComplete="off"
                allowClear
                size="middle"
                prefix={<KeyOutlined />}
            />
              <Button
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                >
                Create Token
            </Button>
            </Form>
          );
        }}
      </Formik> */}
    </div>
  );
};

export default NewApiToken;