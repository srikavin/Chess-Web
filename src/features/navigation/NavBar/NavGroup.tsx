import React, {ReactNode} from 'react';
import styles from './NavBar.module.css';
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

interface NavGroupProps {
    children: ReactNode;
    align: 'left' | 'right'
}

export function NavGroup({align = 'left', children}: NavGroupProps) {
    let className = cx({
        group: true,
        left: align === 'left',
        right: align === 'right'
    });

    return (
        <div className={className}>
            {children}
        </div>
    );
}
