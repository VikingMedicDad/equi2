import { useMemo } from "react";
import { differenceInMilliseconds } from "date-fns";

export type Props = {
  runTimer: boolean;
  startTime: Date;
  endTime?: Date;
};

function useTimer({ startTime, endTime, runTimer }: Props) {
  const initialTime = useMemo(() => {
    const endDate = endTime ? new Date(endTime) : new Date();
    return differenceInMilliseconds(endDate, new Date(startTime));
  }, [startTime, endTime]);

  const startImmediately = !endTime && runTimer;

  //use a unique key to force re-render of Timer when startTime or endTime change
  const timerKey =
    (startTime ? startTime.toString() : "") +
    (endTime ? endTime.toString() : "");

  const result = {
    timerKey,
    startImmediately,
    initialTime
  };

  return result;
}

export default useTimer;
