import React, {useEffect, useState} from "react";
import styles from './ChessClock.module.css';

export interface PureClockProps {
    /**
     * Remaining time in milliseconds
     */
    timeLeft: number
}

export function PureClock(props: PureClockProps) {
    if (props.timeLeft < 0) {
        return <>Expired</>;
    }

    const hours = Math.floor(props.timeLeft / 3600000)
    const minutes = Math.floor((props.timeLeft - (hours * 3600000)) / 60000)
    const seconds = Math.floor((props.timeLeft - (hours * 3600000) - (minutes * 60000)) / 1000)
    const deciSeconds = Math.floor((props.timeLeft - (hours * 3600000) - (minutes * 60000) - (seconds * 1000)) / 100)

    return (
        <div className={styles.clock}>
            {hours > 0 ? (
                <span>{hours.toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping: false})}</span>
            ) : null}
            <span>{minutes.toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping: false})}</span>
            <span>{seconds.toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping: false})}</span>
            {hours === 0 && minutes < 5 ? (
                <span>{deciSeconds.toLocaleString(undefined, {minimumIntegerDigits: 1, useGrouping: false})}</span>
            ) : null}
        </div>
    );
}


export interface ClockProps {
    endTimeEpoch: number;
    isActive: boolean;
}

export function Clock(props: ClockProps) {
    // time is measured in milliseconds
    const [timeLeft, setTimeLeft] = useState(props.endTimeEpoch - Date.now());

    useEffect(() => {
        if (!props.isActive) {
            setTimeLeft((props.endTimeEpoch - Date.now()));
            return;
        }
        const timeoutId = window.setInterval(() => {
            if (!props.isActive) {
                return;
            }
            setTimeLeft((props.endTimeEpoch - Date.now()));
        }, 50);

        return () => {
            window.clearInterval(timeoutId);
        }
    }, [props.endTimeEpoch, props.isActive]);

    return (
        <>
            <PureClock timeLeft={timeLeft}/>
        </>
    )
}
