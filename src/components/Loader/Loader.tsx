import React from "react";

import styles from './Loader.module.css'
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

export interface LoaderProps {
    size: 'small' | 'medium' | 'large'
}

export function Loader({size = 'medium'}: LoaderProps) {
    let classes = cx({
        loader: true,
        small: size === 'small',
        medium: size === 'medium',
        large: size === 'large'
    });

    return (
        <div className={classes}>Loading...</div>
    )
}