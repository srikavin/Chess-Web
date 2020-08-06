import React from 'react';
import NavLink from './NavLink/NavLink';
import {NavDivider} from "./NavBar/NavDivider";
import {NavGroup} from "./NavBar/NavGroup";
import {NavHeader} from "./NavBar/NavHeader";
import {NavBar} from "./NavBar/NavBar";
import {Link} from "react-router-dom";

export function Navigation() {
    return (
        <NavBar>
            <NavGroup align={'left'}>
                <NavHeader>
                    <NavLink to={'/'} label="Bishop"/>
                </NavHeader>
                <NavDivider/>
                <NavLink to='/games/' label="Games"/>
                <NavLink to='/users/sVnqCf26BJhGJHQz' label="Test"/>
                <NavLink to='/users/UdhOzGh5bqwat0GN' label="Test2"/>
            </NavGroup>
            <NavGroup align={'right'}>
                <NavDivider/>
            </NavGroup>
        </NavBar>
    )
}
