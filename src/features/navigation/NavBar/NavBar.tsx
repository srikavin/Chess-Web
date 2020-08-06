import React, {ReactNode} from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {
    children: ReactNode
}

export function NavBar(props: NavBarProps) {
    return (
        <nav className={styles.navbar}>
            {props.children}
        </nav>
    );
}
