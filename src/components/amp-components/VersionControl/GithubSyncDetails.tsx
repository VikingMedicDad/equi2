import React, { useEffect } from "react";
import useGithubSyncDetails, { Props } from "@hooks/useGithubSyncDetails";
import { Button , message } from "antd";
const CLASS_NAME = "github-repo-details";

function GithubSyncDetails({ app }: Props) {
  
  const {
    repoUrl,
    errorUpdate,
    errorMessage,
    handleDisableSync
  } = useGithubSyncDetails({ app });

  useEffect(() => {
    if(errorUpdate){
      message.error(errorMessage);
    }
  }, [errorUpdate, errorMessage])

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__details`}>
          <div className={`${CLASS_NAME}__name`}>{app.githubRepo}</div>
          <div>
            <a href={repoUrl} target="github_repo">
              {repoUrl}
            </a>
          </div>
        </div>

        <div className={`${CLASS_NAME}__action`}>
          <Button
            onClick={handleDisableSync}
          >
            Change Repo
          </Button>
        </div>
      </div>

    </div>
  );
}

export default GithubSyncDetails;