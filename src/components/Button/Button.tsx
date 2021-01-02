import * as React from 'react';
import {ReactNode} from 'react';

import styles from './Button.module.css';
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

export interface ButtonProps {
    children: ReactNode;
    minimal?: boolean;
    onClick: () => void;
    icon?: ReactNode;
    className?: string;
}

export function Button(props: ButtonProps) {
    let btnClass = cx({
        button: true,
        minimal: props.minimal,
        hasIcon: props.icon
    }, props.className);

    return (
        <button className={btnClass} type="button" onClick={() => props.onClick()}>
            {props.icon ? (
                <span className={styles.icon}>
                    {props.icon}
                </span>
            ) : null}
            {props.children}
        </button>
    );
}
