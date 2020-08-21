import React from 'react';
import styles from './Skeleton.module.css'
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

export interface SkeletonProps {
    children: any
    align?: 'center' | 'left' | 'right',
    className?: string
}

export function Skeleton(props: SkeletonProps) {
    let classes = cx({
        skeleton: true,
        left: props.align === 'left',
        center: props.align === 'center',
        right: props.align === 'right'
    });

    if (props.children) {
        return React.Children.map(props.children, child => {
            let className = classNames(child?.props?.className || undefined, classes, props.className);

            if (typeof (child) === 'string') {
                return <p className={className}>{child}</p>
            }
            return (
                React.cloneElement(child, {
                    className: className
                })
            )
        });
    }

    return (
        <div className={classes}>
            <div className={props.className}/>
        </div>
    )
}
