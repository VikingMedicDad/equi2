import { useMemo } from "react";
import { last } from "lodash";
import { differenceInSeconds } from "date-fns";
import chalk from "chalk";
import * as models from "models";

export type Props = {
  action?: models.Action;
  title: string;
  versionNumber: string;
  commitId?:string;
};
const SECOND_STRING = "s";

// Make chalk work
//chalk.enabled = true;
/** @see https://github.com/chalk/chalk#chalklevel */
chalk.level = 3;

const LOG_LEVEL_TO_CHALK: {
  [key in models.EnumActionLogLevel]: string;
} = {
  [models.EnumActionLogLevel.Info]: "white",
  [models.EnumActionLogLevel.Error]: "red",
  [models.EnumActionLogLevel.Debug]: "cyan",
  [models.EnumActionLogLevel.Warning]: "yellow",
};

const useActionLog = ({ action, title, versionNumber, commitId }: Props) => {
  const logData = useMemo(() => {
    if (!action?.steps) return [];

    return action?.steps.map((step) => {
      let duration = "";
      if (step.completedAt) {
        const seconds = differenceInSeconds(
          new Date(step.completedAt),
          new Date(step.createdAt)
        );
        duration = seconds.toString().concat(SECOND_STRING);
      }
      return {
        ...step,
        duration: duration,
        messages: step.logs
          ?.map((log) => {
            return chalk`{${LOG_LEVEL_TO_CHALK[log.level]} ${
              log.createdAt
            }  {gray (${log.level})} ${log.message} }`;
          })
          .join("\n"),
      };
    });
  }, [action]);

  const actionStatus = useMemo(() => {
    if (
      logData.find(
        (step) =>
          step.status === models.EnumActionStepStatus.Waiting ||
          step.status === models.EnumActionStepStatus.Running
      )
    )
      return models.EnumActionStepStatus.Running;

    if (
      logData.find((step) => step.status === models.EnumActionStepStatus.Failed)
    )
      return models.EnumActionStepStatus.Failed;

    return models.EnumActionStepStatus.Success;
  }, [logData]);

  const lastStepCompletedAt = useMemo(() => {
    if (actionStatus === models.EnumActionStepStatus.Running) return null;

    return last(logData)?.completedAt;
  }, [logData, actionStatus]);


  const result = {
    actionStatus,
    lastStepCompletedAt,
    logData
  };

  return result;
};

export default useActionLog;
