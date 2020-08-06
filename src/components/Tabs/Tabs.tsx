import React, {Children, ReactElement, ReactNode, useState} from 'react';
import assert from "assert";
import styles from './Tabs.module.css';
import classnames from 'classnames/bind';

let cx = classnames.bind(styles);

interface TabProps {
    name: string,
    children: ReactNode
}

export function Tab(props: TabProps) {
    return <>
        {props.children}
    </>;
}

interface TabsProps {
    children: ReactElement<TabProps>[]
}

export function Tabs(props: TabsProps) {
    const [currentlySelected, setCurrentlySelected] = useState(0);

    return (
        <div className={styles.tabs}>
            <div className={styles.tabs_header}>
                {
                    Children.map(props.children, (e: React.ReactElement<TabProps>, index) => {
                        assert(e.type === Tab);

                        return (
                            <button key={e.props.name}
                                    className={cx(styles.tabs_header, {'tabs_header_selected': currentlySelected === index})}
                                    onClick={() => setCurrentlySelected(index)}>{e.props.name}</button>
                        )
                    })
                }
            </div>

            {props.children[currentlySelected]}
        </div>
    );
}
