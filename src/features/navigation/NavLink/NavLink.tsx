import React, {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '../../../components/Button/Button';

interface NavLinkProps {
    to: string | object;
    icon?: string | ReactNode;
    label: string
}

export function NavLink(props: NavLinkProps) {
    return (
        <Link to={props.to}>
            <Button minimal icon={props.icon} onClick={() => undefined}>{props.label}</Button>
        </Link>
    );
}

export default NavLink;