import React, { useEffect, useRef, useState } from "react";

function getMinutSeconds(minute: number, seconds: number) {
    let updateState: any = undefined;
    if (seconds == 0 && minute > 0) {
        minute = Number(minute) - 1;
    }
    if (seconds == 0) {
        seconds = 59;
    } else {
        seconds = Number(seconds) - 1;
    }
    if (Number(minute) === 0 && Number(seconds) < 10) {
        updateState = { thresholdTimer: true }
    }
    return {
        minute: minute < 10 ? `0${Number(minute)}` : Number(minute),
        seconds: seconds < 10 ? `0${Number(seconds)}` : Number(seconds),
        ...updateState
    };
}

const TimerComponent: React.FC<any> = ({ startTimer = false, initialMinute = 2, initialSeconds = 0, intervalTime = 1000, stopTimerHndlr = () => { }, timerContainerClass = "" }) => {
    let timerRef = useRef<any>({ timerId: undefined });

    const [timerState, setTimerState] = useState<any>({
        minute: initialMinute,
        seconds: initialSeconds,
        thresholdTimer: false,
    });

    useEffect(() => {
        if (Number(timerState.minute) === 0 && Number(timerState.seconds) === 0) {
            setTimeout(() => stopTimerHndlr(), 0);
            clearInterval(timerRef.current.timerId);
        }
    }, [timerState.minute, timerState.seconds]);

    useEffect(() => {
        if (startTimer) {
            setTimerState({
                minute: initialMinute,
                seconds: initialSeconds,
                thresholdTimer: false,
            });
            timerRef.current.timerId = setInterval(() => {
                setTimerState((prevState: any) => {
                    return (getMinutSeconds(prevState.minute, prevState.seconds))
                })
            }, intervalTime)
        }
        return () => clearInterval(timerRef.current.timerId);
    }, [startTimer]);

    const { minute, seconds, thresholdTimer } = timerState;
    return (
        <>
            {timerContainerClass ? <div className={`tw-mb-0 ${thresholdTimer ? "text-danger" : "text-muted"} ${timerContainerClass}`}><span>{minute}</span><span className="tw-mr-1 tw-ml-1">:</span>{seconds}</div> : <h2 className={`tw-mb-0 ${thresholdTimer ? "text-danger" : "text-muted"}`}>{minute}
                <span className="tw-mr-1 tw-ml-1">:</span>{seconds}</h2>}
        </>
    )
}


export const IntervalTimer = React.memo(TimerComponent);