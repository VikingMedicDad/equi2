import React, { useEffect } from "react";
import { NetworkStatus } from "@apollo/client";
import GithubRepoItem from "@amp-components/VersionControl/GithubRepoItem";
import useGithubRepos, { Props } from "@hooks/useGithubRepos";
import { Spin, Button, message , Row, Col, Typography} from "antd"; 
import { UndoOutlined } from "@ant-design/icons";
import useGithubSyncDetails from "@hooks/useGithubSyncDetails";

const { Text } = Typography;

function GithubRepos({ app, isAuthenticatedWithGithub}: Props) {
  
  const {
    loading,
    networkStatus,
    data,
    error,
    errorUpdate,
    errorMessage,
    handleRefresh,
    handleRepoSelected
  } = useGithubRepos({
    app 
  });

  const {
    repoUrl,
  } = useGithubSyncDetails({ app });

  useEffect(() => {
    if(errorUpdate || error){
      message.error(errorMessage);
    }
  }, [errorUpdate, error, errorMessage])

  return (
      <Row>
        <Row>
						<Text disabled={!isAuthenticatedWithGithub} type="secondary">
							<Button type="link" href="https://github.com/new" target="github_repo" disabled={!isAuthenticatedWithGithub}> Click here </Button>
							to create a new repository or choose<sup>**</sup>:&nbsp;
              <Button
                onClick={handleRefresh}
                icon={<UndoOutlined />}
                disabled={networkStatus === NetworkStatus.refetch}
                size="small"
              />
						</Text>
        </Row>
        {(loading || networkStatus === NetworkStatus.refetch) && (
          <Row>
            <Spin />
          </Row>
        )}
        <Row>
       
        {data?.appAvailableGithubRepos.map((repo) => (
          
          <Col span={6} className='my-1'>
            <GithubRepoItem
              key={repo.fullName}
              repo={repo}
              onSelectRepo={handleRepoSelected}
              isCurrentRepo={repo.url === repoUrl}
            />
          </Col>
        ))}
        </Row>
      </Row>
  );
}

export default GithubRepos;