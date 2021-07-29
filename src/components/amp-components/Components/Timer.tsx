import React from "react";
import TimerComponent from "react-compound-timer";
import useTimer from "@hooks/useTimer";

const CLASS_NAME = "amp-timer";
const EMPTY_TIMER = "0m 0s";

type Props = {
  runTimer: boolean;
  startTime: Date;
  endTime?: Date;
};

function Timer({ startTime, endTime, runTimer }: Props) {
  
  const {
    timerKey,
    startImmediately,
    initialTime
  } = useTimer({ startTime, endTime, runTimer });

  return (
    <span className={`${CLASS_NAME}`}>
      {!startTime ? (
        EMPTY_TIMER
      ) : (
        <TimerComponent
          key={timerKey}
          initialTime={initialTime}
          startImmediately={startImmediately}
        >
          <TimerComponent.Hours
            formatValue={(value) => (value ? `${value}h ` : "")}
          />
          <TimerComponent.Minutes />m <TimerComponent.Seconds />s
        </TimerComponent>
      )}
    </span>
  );
}

export default Timer;
