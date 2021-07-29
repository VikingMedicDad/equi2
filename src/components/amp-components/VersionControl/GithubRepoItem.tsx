import React from "react";
import useGithubRepoItem, { Props } from "@hooks/useGithubRepoItem";
import { Button, Tag, Tooltip} from "antd";
import { PushpinFilled, LockFilled, GithubFilled} from "@ant-design/icons";

function GithubRepoItem({ repo, onSelectRepo, isCurrentRepo }: Props) {
  
  const {
    handleRepoSelected
  } = useGithubRepoItem({repo, onSelectRepo});

  return (
    <Tag color={isCurrentRepo?"lime":"blue"}> 
          <Tooltip
            title="Select this repository"
            autoAdjustOverflow={true}
          >
            <Button
              onClick={() => {
                handleRepoSelected(repo);
              }}
              icon={isCurrentRepo?<GithubFilled />:<PushpinFilled />}
              size="small"
              disabled={repo.private}
            />
          </Tooltip>
          {repo.private && (
             <Tooltip
             title="Repository is private"
             autoAdjustOverflow={true}
              >
              <Button
                disabled
                icon={<LockFilled />}
              />
            </Tooltip>
          )}
        <span className={`m-1 py-1`}>
          <a href={repo.url} target="github_repo">
            {repo.fullName}
          </a>
        </span>
    </Tag>
  );
}

export default GithubRepoItem;
