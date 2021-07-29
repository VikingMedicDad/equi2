import React, { useEffect, useRef, useContext } from "react";
import { message, Button, Card, Modal, notification } from "antd";
import { Formik } from "formik";
import { Form, Input } from "formik-antd";
import { GlobalHotKeys } from "react-hotkeys";
import { CROSS_OS_CTRL_ENTER } from "util/hotkeys";
// import CommitValidation from "./CommitValidation";
import useCommit, { INITIAL_VALUES, Props } from "@hooks/useCommit";
import { SaveOutlined, RestOutlined, CompassTwoTone} from "@ant-design/icons";
import useDiscardChanges from "@hooks/useDiscardChanges";
import PendingChangesContext from "@amp-components/VersionControl/PendingChangesContext";


const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const { confirm } = Modal;

const Commit = ({ applicationId, noChanges }: Props) => {
  
  const formRef = useRef(null)

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  const pendingChangesContext = useContext(PendingChangesContext);

  const onComplete = () => {
    notification.open({
      message: 'Pending changes discarded',
      description:
        'Please notice this action cannot be undone. Pending changes have been discarded',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  }

  const onCancel = () => {}

  const {
    loading,
    error,
    errorMessage,
    handleSubmit
  } = useCommit(
    {
      applicationId,
      noChanges
    }
  );

  const {
    loading: discardLoading,
    error : discardError,
    errorMessage : discardErrorMessage,
    handleConfirm: discardhandleConfirm
  } = useDiscardChanges({ applicationId, onComplete, onCancel });

  useEffect(() => {
    if(error){
      message.error(errorMessage);
    }
    if(discardError){
      message.error(discardErrorMessage);
    }
  }, [error, errorMessage, discardError, discardErrorMessage]);


  const confirmDiscard = (): void => {
    confirm({
      title: 'Are you sure you want to discard all pending changes?',
      content: 'This action cannot be undone.',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(() =>{
              discardhandleConfirm()
              return resolve();
          }, 500);
        }).catch(() => console.log('Error during discard'));
      },
      onCancel() {},
    });
  }

  return (
    <Card className={CLASS_NAME}
      bordered={false}
      actions={
        [
          <></>,
          <Button
            type="primary"
            disabled={loading || noChanges || discardLoading}
            danger
            size="small"
            onClick={confirmDiscard}
            icon={<RestOutlined />}
          >
            Discard changes
          </Button>,
          <Button
            type="primary"
            disabled={loading || pendingChangesContext.commitRunning}
            size="small"
            onClick={handleFormSubmit}
            icon={pendingChangesContext.commitRunning ? <CompassTwoTone spin/>:<SaveOutlined />}
          >
            
            {noChanges ? "Rebuild" : "Commit & Build "}
          </Button>
          
        ]
      }
    >
      {/* <CommitValidation applicationId={applicationId} /> */}
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validateOnMount
        innerRef={formRef}
        render = {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };

          return (
            <Form>
              {!loading && (
                <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              )}
              <Form.Item name={'message'}>
                <Input.TextArea
                  rows={7}
                  name="message"
                  disabled={loading}
                  autoFocus
                  placeholder={noChanges ? "Build message" : "Commit message"}
                  autoComplete="off"
                />
              </Form.Item>
              
            </Form>
          );
        }}
      >
      </Formik>
    </Card>
  );
};

export default Commit;