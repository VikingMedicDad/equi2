import React from "react";
import ApplicationSelectorListItem from "@amp-components/Application/ApplicationSelectorListItem";
import { Spin, Card, Button} from "antd";
import useApplicationList from "@hooks/useApplicationList";
import { Props as ApplicationProps } from "@hooks/useApplicationListItem";
import { AppstoreAddOutlined } from '@ant-design/icons';


const CLASS_NAME = "applications-selector__list";

type Props = {
  selectedApplication?: ApplicationProps;
  onApplicationSelected: (application: ApplicationProps) => void;
};

function ApplicationSelectorList({
  onApplicationSelected,
}: Props) {
  
  const {
    loading,
    data,
  } = useApplicationList();

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <Spin />
      ) : (
        <>
         <Card
          title="Avalaible Applications"
          size="small"
          actions={[
            <Button
                className={`${CLASS_NAME}__add-button`}
                type="primary"
                disabled={loading}
                icon={<AppstoreAddOutlined />}
              >
                Create new Application
            </Button>
          ]}
         >
            {data?.apps.map((application) => (
              <ApplicationSelectorListItem
                onApplicationSelected={onApplicationSelected}
                application={{app:application}}
                key={application.id}
              />
            ))}
            
          </Card>
        </>
      )}
    </div>
  );
}

export default ApplicationSelectorList;
