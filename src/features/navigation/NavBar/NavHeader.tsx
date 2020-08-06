import React, {ReactNode} from 'react';
import styles from './NavBar.module.css';

interface NavHeaderProps {
    children: ReactNode
}

export function NavHeader(props: NavHeaderProps) {
    return (
        <div className={styles.heading}>
            {props.children}
        </div>
    );
}