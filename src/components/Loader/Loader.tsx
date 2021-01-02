import React from "react";

import styles from './Loader.module.css'
import classNames from "classnames/bind";

import icon from './loading-pawn.svg';

let cx = classNames.bind(styles);

export interface LoaderProps {
    size?: 'small' | 'medium' | 'large' | 'fill'
}

export function Loader({size = 'fill'}: LoaderProps) {
    let classes = cx({
        "animate-spin": true,
        small: size === 'small',
        medium: size === 'medium',
        large: size === 'large'
    });

    return (
        <div><img className={classes} src={icon} alt={"loading icon"}/></div>
    )
}
